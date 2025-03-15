package ssiosk.ssiosk.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import ssiosk.ssiosk.domain.dto.ModifyOrderRequest;
import ssiosk.ssiosk.domain.dto.OrderResponse;
import ssiosk.ssiosk.domain.dto.OrderRequest;
import ssiosk.ssiosk.exception.CustomException;
import ssiosk.ssiosk.exception.ErrorCode;
import ssiosk.ssiosk.service.OrderServiceImpl;
import ssiosk.ssiosk.service.WebSocketServiceImpl;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Validated
public class OrderRestController {

    private final OrderServiceImpl orderServiceImpl;
    private final WebSocketServiceImpl webSocketServiceImpl;

    @GetMapping("/orders")
    public ResponseEntity<?> getOrders(
            @RequestParam(required = false) LocalDate startAt,
            @RequestParam(required = false) LocalDate endAt,
            @RequestParam(required = false) Integer tableNumber) {

        if (tableNumber != null) {
            if (startAt != null || endAt != null) {
                throw new CustomException(ErrorCode.DATE_MISSING);
            }
            return new ResponseEntity<>(orderServiceImpl.getOrdersByTableNumber(tableNumber), HttpStatus.OK);
        }
        if (startAt != null || endAt != null) {
            return new ResponseEntity<>(orderServiceImpl.getOrderByTime(Optional.ofNullable(startAt), Optional.ofNullable(endAt)), HttpStatus.OK);
        }
        return new ResponseEntity<>(orderServiceImpl.getAllOrders(), HttpStatus.OK);
    }

    @PostMapping("/{tableNumber}/orders")
    public ResponseEntity<?> createOrderByTableNumber(
            @RequestBody
            @Valid List<OrderRequest> orderRequests,
            @PathVariable
            @NotNull(message = "테이블 번호를 입력해주세요.")
            @Min(value = 1, message = "테이블 번호를 1 이상 입력해주세요.") Integer tableNumber) {
        List<OrderResponse> orderResponses = orderServiceImpl.addOrdersByTableNumber(tableNumber, orderRequests);
        webSocketServiceImpl.sendOrdersToAll(orderResponses);
        return new ResponseEntity<>(orderResponses, HttpStatus.CREATED);
    }

    @PutMapping("/orders/{orderId}")
    public ResponseEntity<?> putOrder(
            @RequestBody
            @Valid ModifyOrderRequest modifyOrderRequest,
            @PathVariable
            @NotNull(message = "주문을 입력해주세요.")
            @Min(value = 1, message = "주문 ID를 1 이상 입력해주세요.") Integer orderId) {
        return new ResponseEntity<>(orderServiceImpl.modifyOrder(orderId, modifyOrderRequest), HttpStatus.OK);
    }

    @DeleteMapping("/orders/{orderId}")
    public ResponseEntity<?> deleteOrder(
            @PathVariable
            @NotNull(message = "주문를 입력해주세요.")
            @Min(value = 1, message = "주문 ID를 1 이상 입력해주세요.") Integer orderId) {
        orderServiceImpl.deleteOrder(orderId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/orders/table-number/{tableNumber}")
    public ResponseEntity<?> quitOrdersByTableNumber(
            @PathVariable
            @NotNull(message = "테이블 번호를 입력해주세요.")
            @Min(value = 1, message = "테이블 번호를 1 이상 입력해주세요.") Integer tableNumber) {
        orderServiceImpl.quitOrderByTableNumber(tableNumber);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
