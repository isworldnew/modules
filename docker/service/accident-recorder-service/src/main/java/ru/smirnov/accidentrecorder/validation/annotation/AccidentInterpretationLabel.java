package ru.smirnov.accidentrecorder.validation.annotation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import ru.smirnov.accidentrecorder.validation.validator.AccidentInterpretationValidator;

import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Constraint(validatedBy = AccidentInterpretationValidator.class)
@Documented
public @interface AccidentInterpretationLabel {

    String message() default "Invalid accident interpretation";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
