package ssiosk.ssiosk.exception;

import lombok.Getter;

@Getter
public enum ErrorCode {

    WRONG_PASSWORD(400, "비밀번호가 일치하지 않습니다."),
    DATE_MISSING(400, "날짜가 입력되지 않았습니다."),
    INVALID_FILE_ERROR(400, "올바르지 않은 파일 형식입니다."),
    INVALID_INPUT_TYPE(400, "올바르지 않은 타입이 입력되었습니다."),


    CATEGORY_NOT_FOUND(404, "카테고리가 존재하지 않습니다."),
    MENU_NOT_FOUND(404, "메뉴가 존재하지 않습니다."),
    ORDER_NOT_FOUND(404, "주문이 존재하지 않습니다."),
    EMPTY_TABLE(404, "현재 비어있는 테이블입니다."),

    DUPLICATED_CATEGORY(409,"이미 존재하는 카테고리입니다."),
    DUPLICATED_MENU(409,"이미 존재하는 메뉴입니다."),
    USED_MENU(409, "현재 사용 중인 메뉴입니다. 수정 혹은 삭제할 수 없습니다.")
    ;

    private ErrorCode(int status, String message) {
        this.status = status;
        this.message = message;
    }

    private final int status;
    private final String message;

}
