package ru.smirnov.accidentrecorder.validation.annotation;

import jakarta.validation.Constraint;
import ru.smirnov.accidentrecorder.validation.validator.AccidentInterpretationValidator;

import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Constraint(validatedBy = AccidentInterpretationValidator.class)
@Documented
public @interface AccidentInterpretationLabel {
}
