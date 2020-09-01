rm *.64
for i in "$@"; do
	echo "Converting $i to base 64."
    base64 $i > $i.64
done