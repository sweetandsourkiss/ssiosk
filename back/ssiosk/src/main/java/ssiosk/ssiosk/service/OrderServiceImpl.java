package ssiosk.ssiosk.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ssiosk.ssiosk.domain.dto.ModifyOrderRequest;
import ssiosk.ssiosk.domain.dto.OrderRequest;
import ssiosk.ssiosk.domain.dto.OrderResponse;
import ssiosk.ssiosk.domain.entity.MenuEntity;
import ssiosk.ssiosk.domain.entity.OrderEntity;
import ssiosk.ssiosk.exception.CustomException;
import ssiosk.ssiosk.exception.ErrorCode;
import ssiosk.ssiosk.repository.MenuRepository;
import ssiosk.ssiosk.repository.OrderRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final MenuRepository menuRepository;

    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(OrderResponse::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse modifyOrder(Integer orderId, ModifyOrderRequest modifyOrderRequest) {
        OrderEntity orderEntity = orderRepository.findById(orderId)
                .orElseThrow(() -> new CustomException(ErrorCode.ORDER_NOT_FOUND));

        orderEntity.updateQuantity(modifyOrderRequest.getQuantity());

        return OrderResponse.toDTO(orderEntity);
    }

    @Transactional
    public void deleteOrder(Integer orderId) {
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new CustomException(ErrorCode.ORDER_NOT_FOUND));
        orderRepository.delete(order);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByTableNumber(Integer tableNumber) {
        List<OrderEntity> orders = orderRepository.findAllByTableNumber(tableNumber);
        return orders.stream()
                .map(OrderResponse::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void quitOrderByTableNumber(Integer tableNumber) {
        Integer orderCount = orderRepository.quitOrderByTableNumber(tableNumber);
        if(orderCount == 0) {
            throw new CustomException(ErrorCode.EMPTY_TABLE);
        }
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrderByTime(Optional<LocalDate> startAt, Optional<LocalDate> endAt) {
        LocalDate start = startAt.orElse(LocalDate.of(1995, 04, 21));
        LocalDate end = endAt.orElse(LocalDate.now());
        LocalDateTime startTime = LocalDateTime.of(start, LocalTime.MIN);
        LocalDateTime endTime = LocalDateTime.of(end, LocalTime.MAX);

        return orderRepository.findAllByCompletedAtBetween(startTime, endTime).stream()
                .map(OrderResponse::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<OrderResponse> addOrdersByTableNumber(Integer tableNumber, List<OrderRequest> orderRequests) {
        List<OrderEntity> orders = orderRequests
                .stream()
                .map(orderRequest -> {
                            Optional<OrderEntity> optionalOrderEntity = orderRepository.findByTableNumberAndMenuIdAAndCompletedAtIsNull(tableNumber, orderRequest.getMenuId());
                            OrderEntity orderEntity;

                            if(optionalOrderEntity.isPresent()) {
                                orderEntity = optionalOrderEntity.get();
                                orderEntity.updateQuantity(orderEntity.getQuantity() + orderRequest.getQuantity());

                                return orderEntity;
                            }

                            MenuEntity menuEntity = menuRepository.findByIdAndIsDeletedIsFalse(orderRequest.getMenuId())
                                    .orElseThrow(() -> new CustomException(ErrorCode.MENU_NOT_FOUND));

                            orderEntity = OrderRequest.toEntity(orderRequest);
                            orderEntity.updateMenu(menuEntity);
                            orderEntity.updateTableNumber(tableNumber);

                            return orderEntity;
                        }
                )
                .collect(Collectors.toList());

        orders = orderRepository.saveAll(orders);

        return orders
                .stream()
                .map(OrderResponse::toDTO)
                .collect(Collectors.toList());
    }

}
