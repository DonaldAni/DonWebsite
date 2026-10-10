import ffmpeg
import os
import sys

def reencode(src, output):
    (
        ffmpeg
            .input(src)
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

    # we don't actually care that much about keeping the original. move to overwrite
    os.replace(output, src)

if not os.path.exists("./videos/encoded"):
    os.mkdir("./videos/encoded")

print(sys.argv)

if len(sys.argv) > 1 and sys.argv[1] == "-single":
    file = input("which file to re-encode: ")
    if not file.endswith(".mp4"):
        file = file + ".mp4"
    reencode(f"./videos/{file}", f"./videos/encoded/{file}")
else:
    for video in os.listdir("./videos"):
        if not video.endswith(".mp4"):
            print(f"skipping {video} as it is not an mp4")
            continue

        input =  f"./videos/{video}"
        output = f"./videos/encoded/{video}"
        
        reencode(input, output)

        print(f"re-encoded {video}")

# clean up
os.rmdir("./videos/encoded")
print("done")