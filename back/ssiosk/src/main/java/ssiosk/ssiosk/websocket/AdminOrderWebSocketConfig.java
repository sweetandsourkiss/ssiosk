package ssiosk.ssiosk.websocket;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
@RequiredArgsConstructor
public class AdminOrderWebSocketConfig implements WebSocketConfigurer {
    private final AdminOrderWebsocketHandler orderWebsocketHandler;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(orderWebsocketHandler, "/ws/order")
                .setAllowedOriginPatterns("http://localhost:3000")
                .setAllowedOriginPatterns("*");
    }
}
