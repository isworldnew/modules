package ru.smirnov.accidentrecorder.validation.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import ru.smirnov.accidentrecorder.entity.auxiliary.fixed.TrespasserRelation;
import ru.smirnov.accidentrecorder.validation.annotation.TrespasserRelationLabel;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

public class TrespasserRelationValidator implements ConstraintValidator<TrespasserRelationLabel, String> {

    @Override
    public boolean isValid(String relation, ConstraintValidatorContext constraintValidatorContext) {

        Set<String> trespasserRelations = Arrays.stream(TrespasserRelation.values())
                .map(trespasserRelation -> trespasserRelation.name())
                .collect(Collectors.toSet());

        if (!trespasserRelations.contains(relation.toUpperCase())) {
            constraintValidatorContext.disableDefaultConstraintViolation();
            constraintValidatorContext.buildConstraintViolationWithTemplate(
                    "Trespasser's relation valid values are: " + Arrays.toString(TrespasserRelation.values())
            ).addConstraintViolation();
            return false;
        }

        return true;
    }
}
