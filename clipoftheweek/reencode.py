import ffmpeg
import os

if not os.path.exists("./videos/encoded"):
    os.mkdir("./videos/encoded")

for video in os.listdir("./videos"):
    if not video.endswith(".mp4"):
        print(f"skipping {video} as it is not an mp4")
        continue

    input =  f"./videos/{video}"
    output = f"./videos/encoded/{video}"
    
    (
        ffmpeg
            .input(input)
            .output(
                output,
                vcodec="libx264",
                acodec="aac",
                pix_fmt="yuv420p",
                crf=23,
                audio_bitrate="128k",
                movflags="+faststart"
            )
            .overwrite_output()
            .run()
    )

    print(f"re-encoded {video}")

    # we don't actually care that much about keeping the original. move to overwrite
    os.replace(output, input)

# clean up
os.rmdir("./videos/encoded")
print("done")