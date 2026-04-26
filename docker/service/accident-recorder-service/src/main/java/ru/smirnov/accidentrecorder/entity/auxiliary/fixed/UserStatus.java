package ru.smirnov.accidentrecorder.entity.auxiliary.fixed;

public enum UserStatus {

    ENABLED {
        @Override
        public boolean isEnabled() {
            return true;
        }
    },

    DISABLED {
        @Override
        public boolean isEnabled() {
            return false;
        }
    };

    public abstract boolean isEnabled();
}
