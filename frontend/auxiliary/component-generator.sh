#!/bin/bash

if [ -z "$1" ]; then
    echo "Ошибка: не передана строка"
    echo "Использование: $0 <строка>"
    exit 1
fi

NAME="$1"

if [ -d "$NAME" ]; then
    echo "Ошибка: папка '$NAME' уже существует"
    exit 1
fi

mkdir "$NAME"

touch "$NAME/$NAME.css"

cat > "$NAME/$NAME.jsx" << EOF
import './$NAME.css';

export default function $NAME() {
    return <>
    
    </>
}
EOF

echo "Компонент '$NAME' успешно создан"
echo "$NAME/"
echo "$NAME/$NAME.css"
echo "$NAME/$NAME.jsx"