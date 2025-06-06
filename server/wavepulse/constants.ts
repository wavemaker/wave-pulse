export const EVENTS = {
    CONSOLE: {
        LOG: 'console-log'
    },
    DOM: {
        REFRESH: 'refresh'
    },
    VARIABLE: {
        BEFORE_INVOKE: 'variable-before-invoke',
        AFTER_INVOKE: 'variable-after-invoke'
    },
    SERVICE: {
        BEFORE_CALL: 'service_before_call',
        AFTER_CALL: 'service_after_call'
    },
    TIMELINE: {
        EVENT: 'timeline-event'
    }
};

export const CALLS = {
    APP: {
        INFO: 'GET_APP_INFO',
    },
    PLATFORM: {
        INFO: 'GET_PLATFORM_INFO',
    },
    DATABASE: {
        INFO: 'LIST_DATABASES',
        EXECUTE_SQL: 'EXECUTE_SQL'
    },
    HANDSHAKE: {
        RELOAD: 'RELOAD',
        WISH: 'SAY_HELLO'
    },
    WIDGET: {
        GET: 'GET_WIDGET',
        HIGHLIGHT: 'HIGHLIGHT',
        GET_PROPERTIES_N_STYLES: 'GET_PROPERTIES_N_STYLES',
        TREE: 'GET_WIDGET_TREE'
    },
    EXPRESSION: {
        EVAL: 'EVAL'
    },
    UI: {
        REFRESH: 'REFRESH'
    },
    STATS: {
        START_UP: 'START_UP_METRICS',
        NAVIGATION: 'NAVIGATION_METRICS'
    },
    THEME: {
        GET: 'GET_THEME',
        GET_ACTIVE_THEME: 'GET_ACTIVE_THEME'
    },
    STORAGE: {
        GET: 'GET',
        SET: 'SET',
        REMOVE: 'REMOVE',
        GET_ALL: 'GET_ALL'
    },
    LOCALE: {
        GET: 'GET_LOCALE'
    }
};
