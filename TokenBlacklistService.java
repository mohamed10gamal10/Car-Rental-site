package com.Carrental.car.security;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Keeps track of tokens that were explicitly logged out.
 * Since JWT is stateless, logout is implemented by blacklisting the token
 * until it naturally expires. For a multi-instance deployment, replace this
 * in-memory map with a shared store (e.g. Redis).
 */
@Service
public class TokenBlacklistService {

    private final Map<String, Long> blacklist = new ConcurrentHashMap<>();

    public void blacklist(String token, long expirationEpochMillis) {
        blacklist.put(token, expirationEpochMillis);
        cleanUp();
    }

    public boolean isBlacklisted(String token) {
        return blacklist.containsKey(token);
    }

    private void cleanUp() {
        long now = System.currentTimeMillis();
        blacklist.entrySet().removeIf(entry -> entry.getValue() < now);
    }
}
