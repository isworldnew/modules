package ru.smirnov.accidentrecorder.validation.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import ru.smirnov.accidentrecorder.entity.auxiliary.fixed.AccidentInterpretation;
import ru.smirnov.accidentrecorder.entity.auxiliary.fixed.Role;
import ru.smirnov.accidentrecorder.validation.annotation.RoleLabel;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

public class RoleValidator implements ConstraintValidator<RoleLabel, String> {

    @Override
    public boolean isValid(String label, ConstraintValidatorContext constraintValidatorContext) {

        Set<String> roleLabels = Arrays.stream(Role.values())
                .map(roleLabel -> roleLabel.name())
                .collect(Collectors.toSet());

        if (!roleLabels.contains(label.toUpperCase())) {
            constraintValidatorContext.disableDefaultConstraintViolation();
            constraintValidatorContext.buildConstraintViolationWithTemplate(
                    "Valid roles are: " + Arrays.toString(Role.values())
            ).addConstraintViolation();
            return false;
        }

        return true;
    }
}
