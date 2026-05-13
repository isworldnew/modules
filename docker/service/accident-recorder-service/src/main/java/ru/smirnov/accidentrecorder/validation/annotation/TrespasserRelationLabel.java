package ru.smirnov.accidentrecorder.validation.annotation;


import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import ru.smirnov.accidentrecorder.validation.validator.TrespasserRelationValidator;

import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.PARAMETER, ElementType.FIELD})
@Constraint(validatedBy = TrespasserRelationValidator.class)
@Documented
public @interface TrespasserRelationLabel {

    String message() default "Invalid trespasser relation";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
