package ssiosk.ssiosk.service;

import org.springframework.stereotype.Service;
import ssiosk.ssiosk.domain.dto.ModifyOrderRequest;
import ssiosk.ssiosk.domain.dto.OrderRequest;
import ssiosk.ssiosk.domain.dto.OrderResponse;

import java.text.ParseException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public interface OrderService {
    public List<OrderResponse> getAllOrders();
    public OrderResponse modifyOrder(Integer orderId, ModifyOrderRequest modifyOrderRequest);
    public void deleteOrder(Integer orderId);
    public List<OrderResponse> getOrdersByTableNumber(Integer tableNumber);
    public void quitOrderByTableNumber(Integer tableNumber);
    public List<OrderResponse> getOrderByTime(Optional<LocalDate> startAt, Optional<LocalDate> endAt) throws ParseException;
    public List<OrderResponse> addOrdersByTableNumber(Integer tableNumber, List<OrderRequest> orderRequests);
}
