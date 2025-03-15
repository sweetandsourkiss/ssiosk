package ssiosk.ssiosk.service;

import ssiosk.ssiosk.domain.dto.OrderResponse;

import java.util.List;

public interface WebSocketService {
    void sendOrdersToAll(List<OrderResponse> responses);
}
