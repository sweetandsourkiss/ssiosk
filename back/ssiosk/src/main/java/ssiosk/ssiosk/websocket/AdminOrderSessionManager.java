package ssiosk.ssiosk.websocket;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Consumer;

@Component
public class AdminOrderSessionManager {
    private final ConcurrentHashMap<String, WebSocketSession> sessionMap = new ConcurrentHashMap<>();

    public void addSession(WebSocketSession session) {
        String sessionId = session.getId();
        sessionMap.put(sessionId, session);
    }

    public void closeSession(WebSocketSession session) {
        sessionMap.remove(session.getId());
    }

    public void workAllSession(Consumer<WebSocketSession> func) {
        sessionMap.values().stream().forEach(session -> func.accept(session));
    }
}
