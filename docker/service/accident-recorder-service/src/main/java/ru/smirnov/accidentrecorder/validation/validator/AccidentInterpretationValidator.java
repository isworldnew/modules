package ru.smirnov.accidentrecorder.validation.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import ru.smirnov.accidentrecorder.entity.auxiliary.fixed.AccidentInterpretation;
import ru.smirnov.accidentrecorder.entity.auxiliary.fixed.AccidentType;
import ru.smirnov.accidentrecorder.validation.annotation.AccidentInterpretationLabel;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

public class AccidentInterpretationValidator implements ConstraintValidator<AccidentInterpretationLabel, String> {

    @Override
    public boolean isValid(String interpretation, ConstraintValidatorContext constraintValidatorContext) {

        Set<String> accidentInterpretations = Arrays.stream(AccidentInterpretation.values())
                .map(accidentInterpretation -> accidentInterpretation.name())
                .collect(Collectors.toSet());

        if (!accidentInterpretations.contains(interpretation.toUpperCase())) {
            constraintValidatorContext.disableDefaultConstraintViolation();
            constraintValidatorContext.buildConstraintViolationWithTemplate(
                    "Accident's interpretation valid values are: " + Arrays.toString(AccidentInterpretation.values())
            ).addConstraintViolation();
            return false;
        }

        return true;
    }
}
