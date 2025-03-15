package ssiosk.ssiosk.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import ssiosk.ssiosk.domain.dto.ErrorResult;

import java.util.List;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleNotValidException(MethodArgumentNotValidException exception) {
        List<ErrorResult> errorResultList = exception.getBindingResult().getAllErrors().stream()
                .map(error -> new ErrorResult(error.getDefaultMessage()))
                .collect(Collectors.toList());

        return new ResponseEntity<>(errorResultList, HttpStatus.valueOf(400));
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<?> handleNotValidTypeException(MethodArgumentTypeMismatchException exception) {
        return new ResponseEntity<>(new ErrorResult(ErrorCode.INVALID_INPUT_TYPE.getMessage()), HttpStatus.valueOf(400));
    }

    @ExceptionHandler
    public ResponseEntity<?> handleException(CustomException exception) {
        ErrorCode errorCode = exception.getErrorCode();
        return new ResponseEntity<>(new ErrorResult(errorCode.getMessage()), HttpStatus.valueOf(errorCode.getStatus()));
    }
}