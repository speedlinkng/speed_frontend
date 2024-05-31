
        (function(store) {
            store.addPlugin(function(store) {
                store.setWithExpiration = function(key, value, expirationInMillis) {
                    const now = Date.now();
                    const item = {
                        value: value,
                        expiration: now + expirationInMillis
                    };
                    store.set(key, item);
                };

                store.getWithExpiration = function(key) {
                    const item = store.get(key);
                    if (!item) {
                        return null;
                    }
                    const now = Date.now();
                    if (now > item.expiration) {
                        store.remove(key);
                        return null;
                    }
                    return item.value;
                };
            });
        })(window.store);
