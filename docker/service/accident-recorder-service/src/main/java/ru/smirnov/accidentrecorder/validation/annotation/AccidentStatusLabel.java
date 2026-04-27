package ru.smirnov.accidentrecorder.validation.annotation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import ru.smirnov.accidentrecorder.validation.validator.AccidentStatusValidator;

import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Constraint(validatedBy = AccidentStatusValidator.class)
@Documented
public @interface AccidentStatusLabel {

    String message() default "Invalid accident status";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
