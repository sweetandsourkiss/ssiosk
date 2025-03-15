package ssiosk.ssiosk.websocket;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;


@Component
@RequiredArgsConstructor
public class AdminOrderWebsocketHandler extends TextWebSocketHandler {
    private final AdminOrderSessionManager adminOrderSessionManager;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        adminOrderSessionManager.addSession(session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        adminOrderSessionManager.closeSession(session);
    }
}
