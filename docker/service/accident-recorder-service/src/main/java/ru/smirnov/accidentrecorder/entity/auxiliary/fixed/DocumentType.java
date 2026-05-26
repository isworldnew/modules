package ru.smirnov.accidentrecorder.entity.auxiliary.fixed;

import lombok.Getter;

@Getter
public enum DocumentType {

    ACT("Акт выявления нарушения требований охраны труда");

    private final String interpretation;

    DocumentType(String interpretation) {
        this.interpretation = interpretation;
    }
}
