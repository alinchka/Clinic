package net.clinic.springboot.model;

import lombok.Getter;

@Getter
public enum Role {
    USER("Пользователь"),
    ADMIN("Администратор");

    private final String name;

    Role(String name) {
        this.name = name;
    }

}
