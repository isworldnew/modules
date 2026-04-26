package ru.smirnov.accidentrecorder.message;

import lombok.Getter;

@Getter
public enum VestClassification {

    /*
         тут очень скользкий костыль:
         у меня в конфигурации модели NO_VEST имеет класс 0, а VEST имеет класс 1
         и нумерация у констант енама будет такая же
         дополнительно ещё константы прописал
     */

    NO_VEST(0), VEST(1);

    private final int classId;

    VestClassification(int classId) {
        this.classId = classId;
    }

}
