package ru.smirnov.accidentrecorder.service.implementation.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import ru.smirnov.accidentrecorder.message.VestClassification;
import ru.smirnov.accidentrecorder.service.abstraction.util.AccidentIgnoringCriteria;

@Component
public class AccidentIgnoringCriteriaImplementation implements AccidentIgnoringCriteria {

    @Value("${confidence-threshold}")
    // @Value("${confidence-threshold:0.5}") // прикол: можно значение по умолчанию задать
    private double confidenceThreshold;

    @Override
    public boolean ignore(VestClassification supposedClass, double supposedConfidence) {

        if (supposedClass == VestClassification.NO_VEST) return false;

        if (supposedClass == VestClassification.VEST && supposedConfidence < this.confidenceThreshold) return false;

        return true;
    }

}
