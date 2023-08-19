for i in `ls raw/*.jpg`; do
    base=`basename $i .jpg`
    convert $i -resize 640x480 -colorspace Gray ${base}.png
    convert ${base}.png -dither FloydSteinberg -colors 5 -remap pattern:gray50 ${base}.png
done
