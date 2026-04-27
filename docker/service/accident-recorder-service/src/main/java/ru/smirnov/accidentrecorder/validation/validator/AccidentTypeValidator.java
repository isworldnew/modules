package ru.smirnov.accidentrecorder.validation.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import ru.smirnov.accidentrecorder.entity.auxiliary.fixed.AccidentStatus;
import ru.smirnov.accidentrecorder.entity.auxiliary.fixed.AccidentType;
import ru.smirnov.accidentrecorder.validation.annotation.AccidentTypeLabel;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

public class AccidentTypeValidator implements ConstraintValidator<AccidentTypeLabel, String> {

    @Override
    public boolean isValid(String type, ConstraintValidatorContext constraintValidatorContext) {

        Set<String> accidentTypes = Arrays.stream(AccidentType.values())
                .map(accidentType -> accidentType.name())
                .collect(Collectors.toSet());

        if (!accidentTypes.contains(type.toUpperCase())) {
            constraintValidatorContext.disableDefaultConstraintViolation();
            constraintValidatorContext.buildConstraintViolationWithTemplate(
                    "Accident's type valid values are: " + Arrays.toString(AccidentType.values())
            ).addConstraintViolation();
            return false;
        }

        return true;
    }
}
