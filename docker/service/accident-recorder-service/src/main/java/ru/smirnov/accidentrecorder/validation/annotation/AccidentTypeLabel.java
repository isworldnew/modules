package ru.smirnov.accidentrecorder.validation.annotation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import ru.smirnov.accidentrecorder.validation.validator.AccidentTypeValidator;

import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD, ElementType.TYPE})
@Constraint(validatedBy = AccidentTypeValidator.class)
@Documented
public @interface AccidentTypeLabel {

    String message() default "Invalid accident type";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
