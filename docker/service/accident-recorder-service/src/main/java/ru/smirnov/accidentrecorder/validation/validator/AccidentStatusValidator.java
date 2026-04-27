package ru.smirnov.accidentrecorder.validation.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import ru.smirnov.accidentrecorder.entity.auxiliary.fixed.AccidentStatus;
import ru.smirnov.accidentrecorder.validation.annotation.AccidentStatusLabel;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

public class AccidentStatusValidator implements ConstraintValidator<AccidentStatusLabel, String> {

    @Override
    public boolean isValid(String status, ConstraintValidatorContext constraintValidatorContext) {

        Set<String> accidentStatuses = Arrays.stream(AccidentStatus.values())
                .map(accidentStatus -> accidentStatus.name())
                .collect(Collectors.toSet());

        if (!accidentStatuses.contains(status.toUpperCase())) {
            constraintValidatorContext.disableDefaultConstraintViolation();
            constraintValidatorContext.buildConstraintViolationWithTemplate(
                    "Accident's status valid values are: " + Arrays.toString(AccidentStatus.values())
            ).addConstraintViolation();
            return false;
        }

        return true;
    }
}
