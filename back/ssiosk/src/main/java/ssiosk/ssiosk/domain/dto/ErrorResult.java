package ssiosk.ssiosk.domain.dto;

import lombok.Getter;

@Getter
public class ErrorResult {

    private String message;

    public ErrorResult(String message) {
        this.message = message;
    }
}

