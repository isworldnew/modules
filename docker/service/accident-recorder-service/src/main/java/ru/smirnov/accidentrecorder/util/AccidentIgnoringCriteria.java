package ru.smirnov.accidentrecorder.util;

import ru.smirnov.accidentrecorder.message.VestClassification;

@FunctionalInterface
public interface AccidentIgnoringCriteria {

    boolean ignore(VestClassification supposedClass, double supposedConfidence);

}
