// Re-encodes a video for the web with AVFoundation (no ffmpeg needed):
// audio dropped (hero videos autoplay muted), target bitrate, optional
// centre crop + resize, H.264 or HEVC (tagged hvc1 so Safari plays it),
// moov atom first so playback can start before the download finishes.
//
// usage:
//   swift scripts/video-to-web.swift <input> <output.mp4> \
//     [--codec h264|hevc] [--kbps 1800] [--width 1280] [--crop-aspect 0.5625]
//   --crop-aspect: width/height of a centre crop taken from the source
//                  before resizing (e.g. 0.5625 = 9:16 portrait for phones)
import AVFoundation
import CoreImage

var args = Array(CommandLine.arguments.dropFirst())
func opt(_ name: String) -> String? {
    guard let i = args.firstIndex(of: name), i + 1 < args.count else { return nil }
    let v = args[i + 1]
    args.removeSubrange(i...(i + 1))
    return v
}
let codecName = opt("--codec") ?? "h264"
let kbps = Int(opt("--kbps") ?? "1800") ?? 1800
let maxWidth = Double(opt("--width") ?? "1920") ?? 1920
let cropAspect = opt("--crop-aspect").flatMap(Double.init)
guard args.count == 2 else {
    print("usage: swift video-to-web.swift <input> <output.mp4> [--codec h264|hevc] [--kbps N] [--width W] [--crop-aspect A]")
    exit(1)
}
let inputURL = URL(fileURLWithPath: args[0])
let outputURL = URL(fileURLWithPath: args[1])

let sem = DispatchSemaphore(value: 0)
Task {
    do {
        let asset = AVURLAsset(url: inputURL)
        guard let track = try await asset.loadTracks(withMediaType: .video).first else { print("no video"); exit(1) }
        let natural = try await track.load(.naturalSize)
        let transform = try await track.load(.preferredTransform)
        let fps = try await track.load(.nominalFrameRate)
        // Upright source size
        let upright = natural.applying(transform)
        let srcW = abs(upright.width), srcH = abs(upright.height)

        // Centre crop (in source pixels), then scale down to maxWidth.
        var cropW = srcW, cropH = srcH
        if let a = cropAspect {
            // Even dimensions: H.264/HEVC need them, and an odd crop would be
            // stretched by a pixel when encoded.
            if srcW / srcH > a { cropW = ((srcH * a) / 2).rounded() * 2 } else { cropH = ((srcW / a) / 2).rounded() * 2 }
        }
        let scale = min(1.0, maxWidth / Double(cropW))
        let outW = Int((Double(cropW) * scale / 2).rounded()) * 2
        let outH = Int((Double(cropH) * scale / 2).rounded()) * 2

        let reader = try AVAssetReader(asset: asset)
        let comp = AVMutableVideoComposition()
        comp.renderSize = CGSize(width: cropW, height: cropH)
        comp.frameDuration = CMTime(value: 1, timescale: CMTimeScale(max(fps, 24).rounded()))
        let instruction = AVMutableVideoCompositionInstruction()
        instruction.timeRange = CMTimeRange(start: .zero, duration: try await asset.load(.duration))
        let layer = AVMutableVideoCompositionLayerInstruction(assetTrack: track)
        let shift = CGAffineTransform(translationX: -(srcW - cropW) / 2, y: -(srcH - cropH) / 2)
        layer.setTransform(transform.concatenating(shift), at: .zero)
        instruction.layerInstructions = [layer]
        comp.instructions = [instruction]

        let out = AVAssetReaderVideoCompositionOutput(videoTracks: [track], videoSettings: [
            kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA,
        ])
        out.videoComposition = comp
        reader.add(out)

        try? FileManager.default.removeItem(at: outputURL)
        let writer = try AVAssetWriter(outputURL: outputURL, fileType: .mp4)
        writer.shouldOptimizeForNetworkUse = true
        var compression: [String: Any] = [
            AVVideoAverageBitRateKey: kbps * 1000,
            AVVideoMaxKeyFrameIntervalKey: Int(max(fps, 24).rounded()) * 2,
            AVVideoAllowFrameReorderingKey: true,
        ]
        let codec: AVVideoCodecType
        if codecName == "hevc" {
            codec = .hevc
            compression[AVVideoProfileLevelKey] = kVTProfileLevel_HEVC_Main_AutoLevel as String
        } else {
            codec = .h264
            compression[AVVideoProfileLevelKey] = AVVideoProfileLevelH264HighAutoLevel
        }
        let input = AVAssetWriterInput(mediaType: .video, outputSettings: [
            AVVideoCodecKey: codec,
            AVVideoWidthKey: outW,
            AVVideoHeightKey: outH,
            AVVideoScalingModeKey: AVVideoScalingModeResizeAspectFill,
            AVVideoCompressionPropertiesKey: compression,
        ])
        input.expectsMediaDataInRealTime = false
        writer.add(input)

        reader.startReading()
        writer.startWriting()
        writer.startSession(atSourceTime: .zero)
        let queue = DispatchQueue(label: "encode")
        await withCheckedContinuation { (done: CheckedContinuation<Void, Never>) in
            input.requestMediaDataWhenReady(on: queue) {
                while input.isReadyForMoreMediaData {
                    if let buf = out.copyNextSampleBuffer() {
                        input.append(buf)
                    } else {
                        input.markAsFinished()
                        done.resume()
                        return
                    }
                }
            }
        }
        await writer.finishWriting()
        if writer.status != .completed { print("error", writer.error as Any); exit(1) }
        print("ok \(codecName) \(outW)x\(outH) @\(kbps)kbps", outputURL.path)
    } catch {
        print("error", error)
        exit(1)
    }
    sem.signal()
}
sem.wait()
