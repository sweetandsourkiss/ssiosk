package ssiosk.ssiosk.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import ssiosk.ssiosk.domain.dto.OrderResponse;
import ssiosk.ssiosk.websocket.AdminOrderSessionManager;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WebSocketServiceImpl implements WebSocketService{
    private final AdminOrderSessionManager sessionManager;
    private final ObjectMapper mapper = new ObjectMapper();

    public void sendOrdersToAll(List<OrderResponse> responses) {
        sessionManager.workAllSession(session -> {
            try {
                session.sendMessage(new TextMessage(mapper.writeValueAsString(responses)));
            } catch (IOException e) {
                e.printStackTrace();
            }
        });
    }
}
