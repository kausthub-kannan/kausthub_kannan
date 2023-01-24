
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop$1() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop$1;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop$1;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
        return style.sheet;
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { ownerNode } = info.stylesheet;
                // there is no ownerNode if it runs on jsdom.
                if (ownerNode)
                    detach(ownerNode);
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * Schedules a callback to run immediately before the component is updated after any state change.
     *
     * The first time the callback runs will be before the initial `onMount`
     *
     * https://svelte.dev/docs#run-time-svelte-beforeupdate
     */
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    /**
     * Schedules a callback to run immediately after the component has been updated.
     *
     * The first time the callback runs will be after the initial `onMount`
     */
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    /**
     * Schedules a callback to run immediately before the component is unmounted.
     *
     * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
     * only one that runs inside a server-side component.
     *
     * https://svelte.dev/docs#run-time-svelte-ondestroy
     */
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    /**
     * Associates an arbitrary `context` object with the current component and the specified `key`
     * and returns that object. The context is then available to children of the component
     * (including slotted content) with `getContext`.
     *
     * Like lifecycle functions, this must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-setcontext
     */
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    /**
     * Retrieves the context that belongs to the closest parent component with the specified `key`.
     * Must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-getcontext
     */
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        const options = { direction: 'in' };
        let config = fn(node, params, options);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop$1, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config(options);
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop$1,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop$1;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop$1;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.55.1' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    function construct_svelte_component_dev(component, props) {
        const error_message = 'this={...} of <svelte:component> should specify a Svelte component.';
        try {
            const instance = new component(props);
            if (!instance.$$ || !instance.$set || !instance.$on || !instance.$destroy) {
                throw new Error(error_message);
            }
            return instance;
        }
        catch (err) {
            const { message } = err;
            if (typeof message === 'string' && message.indexOf('is not a constructor') !== -1) {
                throw new Error(error_message);
            }
            else {
                throw err;
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function slide(node, { delay = 0, duration = 400, easing = cubicOut } = {}) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const height = parseFloat(style.height);
        const padding_top = parseFloat(style.paddingTop);
        const padding_bottom = parseFloat(style.paddingBottom);
        const margin_top = parseFloat(style.marginTop);
        const margin_bottom = parseFloat(style.marginBottom);
        const border_top_width = parseFloat(style.borderTopWidth);
        const border_bottom_width = parseFloat(style.borderBottomWidth);
        return {
            delay,
            duration,
            easing,
            css: t => 'overflow: hidden;' +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `height: ${t * height}px;` +
                `padding-top: ${t * padding_top}px;` +
                `padding-bottom: ${t * padding_bottom}px;` +
                `margin-top: ${t * margin_top}px;` +
                `margin-bottom: ${t * margin_bottom}px;` +
                `border-top-width: ${t * border_top_width}px;` +
                `border-bottom-width: ${t * border_bottom_width}px;`
        };
    }

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    /**
     * @public
     */
    var Presence;
    (function (Presence) {
        Presence[Presence["Entering"] = 0] = "Entering";
        Presence[Presence["Present"] = 1] = "Present";
        Presence[Presence["Exiting"] = 2] = "Exiting";
    })(Presence || (Presence = {}));
    /**
     * @public
     */
    var VisibilityAction$1;
    (function (VisibilityAction) {
        VisibilityAction[VisibilityAction["Hide"] = 0] = "Hide";
        VisibilityAction[VisibilityAction["Show"] = 1] = "Show";
    })(VisibilityAction$1 || (VisibilityAction$1 = {}));

    const fix = ()=>{
        try{
            
            if (!process.env){
                process.env={};
            }
            return true;;
        }catch(e){}
        
        if (!window || (window.process && window.process.env)){
            return false;
        }
        
        if (!window.process){
            window.process={};
        }
        window.process.env={};
        return true;    
    };

    const fixed = fix();

    const defaultTimestep = (1 / 60) * 1000;
    const getCurrentTime = typeof performance !== "undefined"
        ? () => performance.now()
        : () => Date.now();
    const onNextFrame = typeof window !== "undefined"
        ? (callback) => window.requestAnimationFrame(callback)
        : (callback) => setTimeout(() => callback(getCurrentTime()), defaultTimestep);

    function createRenderStep(runNextFrame) {
        let toRun = [];
        let toRunNextFrame = [];
        let numToRun = 0;
        let isProcessing = false;
        let flushNextFrame = false;
        const toKeepAlive = new WeakSet();
        const step = {
            schedule: (callback, keepAlive = false, immediate = false) => {
                const addToCurrentFrame = immediate && isProcessing;
                const buffer = addToCurrentFrame ? toRun : toRunNextFrame;
                if (keepAlive)
                    toKeepAlive.add(callback);
                if (buffer.indexOf(callback) === -1) {
                    buffer.push(callback);
                    if (addToCurrentFrame && isProcessing)
                        numToRun = toRun.length;
                }
                return callback;
            },
            cancel: (callback) => {
                const index = toRunNextFrame.indexOf(callback);
                if (index !== -1)
                    toRunNextFrame.splice(index, 1);
                toKeepAlive.delete(callback);
            },
            process: (frameData) => {
                if (isProcessing) {
                    flushNextFrame = true;
                    return;
                }
                isProcessing = true;
                [toRun, toRunNextFrame] = [toRunNextFrame, toRun];
                toRunNextFrame.length = 0;
                numToRun = toRun.length;
                if (numToRun) {
                    for (let i = 0; i < numToRun; i++) {
                        const callback = toRun[i];
                        callback(frameData);
                        if (toKeepAlive.has(callback)) {
                            step.schedule(callback);
                            runNextFrame();
                        }
                    }
                }
                isProcessing = false;
                if (flushNextFrame) {
                    flushNextFrame = false;
                    step.process(frameData);
                }
            },
        };
        return step;
    }

    const maxElapsed = 40;
    let useDefaultElapsed = true;
    let runNextFrame = false;
    let isProcessing = false;
    const frame = {
        delta: 0,
        timestamp: 0,
    };
    const stepsOrder = [
        "read",
        "update",
        "preRender",
        "render",
        "postRender",
    ];
    const steps = stepsOrder.reduce((acc, key) => {
        acc[key] = createRenderStep(() => (runNextFrame = true));
        return acc;
    }, {});
    const sync = stepsOrder.reduce((acc, key) => {
        const step = steps[key];
        acc[key] = (process, keepAlive = false, immediate = false) => {
            if (!runNextFrame)
                startLoop();
            return step.schedule(process, keepAlive, immediate);
        };
        return acc;
    }, {});
    const cancelSync = stepsOrder.reduce((acc, key) => {
        acc[key] = steps[key].cancel;
        return acc;
    }, {});
    const flushSync = stepsOrder.reduce((acc, key) => {
        acc[key] = () => steps[key].process(frame);
        return acc;
    }, {});
    const processStep = (stepId) => steps[stepId].process(frame);
    const processFrame = (timestamp) => {
        runNextFrame = false;
        frame.delta = useDefaultElapsed
            ? defaultTimestep
            : Math.max(Math.min(timestamp - frame.timestamp, maxElapsed), 1);
        frame.timestamp = timestamp;
        isProcessing = true;
        stepsOrder.forEach(processStep);
        isProcessing = false;
        if (runNextFrame) {
            useDefaultElapsed = false;
            onNextFrame(processFrame);
        }
    };
    const startLoop = () => {
        runNextFrame = true;
        useDefaultElapsed = true;
        if (!isProcessing)
            onNextFrame(processFrame);
    };
    const getFrameData = () => frame;

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __rest$1(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    var warning = function () { };
    var invariant = function () { };
    if (process.env.NODE_ENV !== 'production') {
        warning = function (check, message) {
            if (!check && typeof console !== 'undefined') {
                console.warn(message);
            }
        };
        invariant = function (check, message) {
            if (!check) {
                throw new Error(message);
            }
        };
    }

    const clamp$1 = (min, max, v) => Math.min(Math.max(v, min), max);

    const safeMin = 0.001;
    const minDuration = 0.01;
    const maxDuration = 10.0;
    const minDamping = 0.05;
    const maxDamping = 1;
    function findSpring({ duration = 800, bounce = 0.25, velocity = 0, mass = 1, }) {
        let envelope;
        let derivative;
        warning(duration <= maxDuration * 1000, "Spring duration must be 10 seconds or less");
        let dampingRatio = 1 - bounce;
        dampingRatio = clamp$1(minDamping, maxDamping, dampingRatio);
        duration = clamp$1(minDuration, maxDuration, duration / 1000);
        if (dampingRatio < 1) {
            envelope = (undampedFreq) => {
                const exponentialDecay = undampedFreq * dampingRatio;
                const delta = exponentialDecay * duration;
                const a = exponentialDecay - velocity;
                const b = calcAngularFreq(undampedFreq, dampingRatio);
                const c = Math.exp(-delta);
                return safeMin - (a / b) * c;
            };
            derivative = (undampedFreq) => {
                const exponentialDecay = undampedFreq * dampingRatio;
                const delta = exponentialDecay * duration;
                const d = delta * velocity + velocity;
                const e = Math.pow(dampingRatio, 2) * Math.pow(undampedFreq, 2) * duration;
                const f = Math.exp(-delta);
                const g = calcAngularFreq(Math.pow(undampedFreq, 2), dampingRatio);
                const factor = -envelope(undampedFreq) + safeMin > 0 ? -1 : 1;
                return (factor * ((d - e) * f)) / g;
            };
        }
        else {
            envelope = (undampedFreq) => {
                const a = Math.exp(-undampedFreq * duration);
                const b = (undampedFreq - velocity) * duration + 1;
                return -safeMin + a * b;
            };
            derivative = (undampedFreq) => {
                const a = Math.exp(-undampedFreq * duration);
                const b = (velocity - undampedFreq) * (duration * duration);
                return a * b;
            };
        }
        const initialGuess = 5 / duration;
        const undampedFreq = approximateRoot(envelope, derivative, initialGuess);
        duration = duration * 1000;
        if (isNaN(undampedFreq)) {
            return {
                stiffness: 100,
                damping: 10,
                duration,
            };
        }
        else {
            const stiffness = Math.pow(undampedFreq, 2) * mass;
            return {
                stiffness,
                damping: dampingRatio * 2 * Math.sqrt(mass * stiffness),
                duration,
            };
        }
    }
    const rootIterations = 12;
    function approximateRoot(envelope, derivative, initialGuess) {
        let result = initialGuess;
        for (let i = 1; i < rootIterations; i++) {
            result = result - envelope(result) / derivative(result);
        }
        return result;
    }
    function calcAngularFreq(undampedFreq, dampingRatio) {
        return undampedFreq * Math.sqrt(1 - dampingRatio * dampingRatio);
    }

    const durationKeys = ["duration", "bounce"];
    const physicsKeys = ["stiffness", "damping", "mass"];
    function isSpringType(options, keys) {
        return keys.some((key) => options[key] !== undefined);
    }
    function getSpringOptions(options) {
        let springOptions = Object.assign({ velocity: 0.0, stiffness: 100, damping: 10, mass: 1.0, isResolvedFromDuration: false }, options);
        if (!isSpringType(options, physicsKeys) &&
            isSpringType(options, durationKeys)) {
            const derived = findSpring(options);
            springOptions = Object.assign(Object.assign(Object.assign({}, springOptions), derived), { velocity: 0.0, mass: 1.0 });
            springOptions.isResolvedFromDuration = true;
        }
        return springOptions;
    }
    function spring(_a) {
        var { from = 0.0, to = 1.0, restSpeed = 2, restDelta } = _a, options = __rest$1(_a, ["from", "to", "restSpeed", "restDelta"]);
        const state = { done: false, value: from };
        let { stiffness, damping, mass, velocity, duration, isResolvedFromDuration, } = getSpringOptions(options);
        let resolveSpring = zero;
        let resolveVelocity = zero;
        function createSpring() {
            const initialVelocity = velocity ? -(velocity / 1000) : 0.0;
            const initialDelta = to - from;
            const dampingRatio = damping / (2 * Math.sqrt(stiffness * mass));
            const undampedAngularFreq = Math.sqrt(stiffness / mass) / 1000;
            if (restDelta === undefined) {
                restDelta = Math.min(Math.abs(to - from) / 100, 0.4);
            }
            if (dampingRatio < 1) {
                const angularFreq = calcAngularFreq(undampedAngularFreq, dampingRatio);
                resolveSpring = (t) => {
                    const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
                    return (to -
                        envelope *
                            (((initialVelocity +
                                dampingRatio * undampedAngularFreq * initialDelta) /
                                angularFreq) *
                                Math.sin(angularFreq * t) +
                                initialDelta * Math.cos(angularFreq * t)));
                };
                resolveVelocity = (t) => {
                    const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
                    return (dampingRatio *
                        undampedAngularFreq *
                        envelope *
                        ((Math.sin(angularFreq * t) *
                            (initialVelocity +
                                dampingRatio *
                                    undampedAngularFreq *
                                    initialDelta)) /
                            angularFreq +
                            initialDelta * Math.cos(angularFreq * t)) -
                        envelope *
                            (Math.cos(angularFreq * t) *
                                (initialVelocity +
                                    dampingRatio *
                                        undampedAngularFreq *
                                        initialDelta) -
                                angularFreq *
                                    initialDelta *
                                    Math.sin(angularFreq * t)));
                };
            }
            else if (dampingRatio === 1) {
                resolveSpring = (t) => to -
                    Math.exp(-undampedAngularFreq * t) *
                        (initialDelta +
                            (initialVelocity + undampedAngularFreq * initialDelta) *
                                t);
            }
            else {
                const dampedAngularFreq = undampedAngularFreq * Math.sqrt(dampingRatio * dampingRatio - 1);
                resolveSpring = (t) => {
                    const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
                    const freqForT = Math.min(dampedAngularFreq * t, 300);
                    return (to -
                        (envelope *
                            ((initialVelocity +
                                dampingRatio * undampedAngularFreq * initialDelta) *
                                Math.sinh(freqForT) +
                                dampedAngularFreq *
                                    initialDelta *
                                    Math.cosh(freqForT))) /
                            dampedAngularFreq);
                };
            }
        }
        createSpring();
        return {
            next: (t) => {
                const current = resolveSpring(t);
                if (!isResolvedFromDuration) {
                    const currentVelocity = resolveVelocity(t) * 1000;
                    const isBelowVelocityThreshold = Math.abs(currentVelocity) <= restSpeed;
                    const isBelowDisplacementThreshold = Math.abs(to - current) <= restDelta;
                    state.done =
                        isBelowVelocityThreshold && isBelowDisplacementThreshold;
                }
                else {
                    state.done = t >= duration;
                }
                state.value = state.done ? to : current;
                return state;
            },
            flipTarget: () => {
                velocity = -velocity;
                [from, to] = [to, from];
                createSpring();
            },
        };
    }
    spring.needsInterpolation = (a, b) => typeof a === "string" || typeof b === "string";
    const zero = (_t) => 0;

    const progress = (from, to, value) => {
        const toFromDifference = to - from;
        return toFromDifference === 0 ? 1 : (value - from) / toFromDifference;
    };

    const mix = (from, to, progress) => -progress * from + progress * to + from;

    const clamp = (min, max) => (v) => Math.max(Math.min(v, max), min);
    const sanitize = (v) => (v % 1 ? Number(v.toFixed(5)) : v);
    const floatRegex = /(-)?([\d]*\.?[\d])+/g;
    const colorRegex = /(#[0-9a-f]{6}|#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2}(-?[\d\.]+%?)\s*[\,\/]?\s*[\d\.]*%?\))/gi;
    const singleColorRegex = /^(#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2}(-?[\d\.]+%?)\s*[\,\/]?\s*[\d\.]*%?\))$/i;
    function isString(v) {
        return typeof v === 'string';
    }

    const number = {
        test: (v) => typeof v === 'number',
        parse: parseFloat,
        transform: (v) => v,
    };
    const alpha = Object.assign(Object.assign({}, number), { transform: clamp(0, 1) });
    const scale = Object.assign(Object.assign({}, number), { default: 1 });

    const createUnitType = (unit) => ({
        test: (v) => isString(v) && v.endsWith(unit) && v.split(' ').length === 1,
        parse: parseFloat,
        transform: (v) => `${v}${unit}`,
    });
    const degrees = createUnitType('deg');
    const percent = createUnitType('%');
    const px = createUnitType('px');
    const vh = createUnitType('vh');
    const vw = createUnitType('vw');
    const progressPercentage = Object.assign(Object.assign({}, percent), { parse: (v) => percent.parse(v) / 100, transform: (v) => percent.transform(v * 100) });

    const isColorString = (type, testProp) => (v) => {
        return Boolean((isString(v) && singleColorRegex.test(v) && v.startsWith(type)) ||
            (testProp && Object.prototype.hasOwnProperty.call(v, testProp)));
    };
    const splitColor = (aName, bName, cName) => (v) => {
        if (!isString(v))
            return v;
        const [a, b, c, alpha] = v.match(floatRegex);
        return {
            [aName]: parseFloat(a),
            [bName]: parseFloat(b),
            [cName]: parseFloat(c),
            alpha: alpha !== undefined ? parseFloat(alpha) : 1,
        };
    };

    const hsla = {
        test: isColorString('hsl', 'hue'),
        parse: splitColor('hue', 'saturation', 'lightness'),
        transform: ({ hue, saturation, lightness, alpha: alpha$1 = 1 }) => {
            return ('hsla(' +
                Math.round(hue) +
                ', ' +
                percent.transform(sanitize(saturation)) +
                ', ' +
                percent.transform(sanitize(lightness)) +
                ', ' +
                sanitize(alpha.transform(alpha$1)) +
                ')');
        },
    };

    const clampRgbUnit = clamp(0, 255);
    const rgbUnit = Object.assign(Object.assign({}, number), { transform: (v) => Math.round(clampRgbUnit(v)) });
    const rgba = {
        test: isColorString('rgb', 'red'),
        parse: splitColor('red', 'green', 'blue'),
        transform: ({ red, green, blue, alpha: alpha$1 = 1 }) => 'rgba(' +
            rgbUnit.transform(red) +
            ', ' +
            rgbUnit.transform(green) +
            ', ' +
            rgbUnit.transform(blue) +
            ', ' +
            sanitize(alpha.transform(alpha$1)) +
            ')',
    };

    function parseHex(v) {
        let r = '';
        let g = '';
        let b = '';
        let a = '';
        if (v.length > 5) {
            r = v.substr(1, 2);
            g = v.substr(3, 2);
            b = v.substr(5, 2);
            a = v.substr(7, 2);
        }
        else {
            r = v.substr(1, 1);
            g = v.substr(2, 1);
            b = v.substr(3, 1);
            a = v.substr(4, 1);
            r += r;
            g += g;
            b += b;
            a += a;
        }
        return {
            red: parseInt(r, 16),
            green: parseInt(g, 16),
            blue: parseInt(b, 16),
            alpha: a ? parseInt(a, 16) / 255 : 1,
        };
    }
    const hex = {
        test: isColorString('#'),
        parse: parseHex,
        transform: rgba.transform,
    };

    const color = {
        test: (v) => rgba.test(v) || hex.test(v) || hsla.test(v),
        parse: (v) => {
            if (rgba.test(v)) {
                return rgba.parse(v);
            }
            else if (hsla.test(v)) {
                return hsla.parse(v);
            }
            else {
                return hex.parse(v);
            }
        },
        transform: (v) => {
            return isString(v)
                ? v
                : v.hasOwnProperty('red')
                    ? rgba.transform(v)
                    : hsla.transform(v);
        },
    };

    const colorToken = '${c}';
    const numberToken = '${n}';
    function test(v) {
        var _a, _b, _c, _d;
        return (isNaN(v) &&
            isString(v) &&
            ((_b = (_a = v.match(floatRegex)) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) + ((_d = (_c = v.match(colorRegex)) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0) > 0);
    }
    function analyse$1(v) {
        if (typeof v === 'number')
            v = `${v}`;
        const values = [];
        let numColors = 0;
        const colors = v.match(colorRegex);
        if (colors) {
            numColors = colors.length;
            v = v.replace(colorRegex, colorToken);
            values.push(...colors.map(color.parse));
        }
        const numbers = v.match(floatRegex);
        if (numbers) {
            v = v.replace(floatRegex, numberToken);
            values.push(...numbers.map(number.parse));
        }
        return { values, numColors, tokenised: v };
    }
    function parse(v) {
        return analyse$1(v).values;
    }
    function createTransformer(v) {
        const { values, numColors, tokenised } = analyse$1(v);
        const numValues = values.length;
        return (v) => {
            let output = tokenised;
            for (let i = 0; i < numValues; i++) {
                output = output.replace(i < numColors ? colorToken : numberToken, i < numColors ? color.transform(v[i]) : sanitize(v[i]));
            }
            return output;
        };
    }
    const convertNumbersToZero = (v) => typeof v === 'number' ? 0 : v;
    function getAnimatableNone$1(v) {
        const parsed = parse(v);
        const transformer = createTransformer(v);
        return transformer(parsed.map(convertNumbersToZero));
    }
    const complex = { test, parse, createTransformer, getAnimatableNone: getAnimatableNone$1 };

    const maxDefaults = new Set(['brightness', 'contrast', 'saturate', 'opacity']);
    function applyDefaultFilter(v) {
        let [name, value] = v.slice(0, -1).split('(');
        if (name === 'drop-shadow')
            return v;
        const [number] = value.match(floatRegex) || [];
        if (!number)
            return v;
        const unit = value.replace(number, '');
        let defaultValue = maxDefaults.has(name) ? 1 : 0;
        if (number !== value)
            defaultValue *= 100;
        return name + '(' + defaultValue + unit + ')';
    }
    const functionRegex = /([a-z-]*)\(.*?\)/g;
    const filter = Object.assign(Object.assign({}, complex), { getAnimatableNone: (v) => {
            const functions = v.match(functionRegex);
            return functions ? functions.map(applyDefaultFilter).join(' ') : v;
        } });

    function hueToRgb(p, q, t) {
        if (t < 0)
            t += 1;
        if (t > 1)
            t -= 1;
        if (t < 1 / 6)
            return p + (q - p) * 6 * t;
        if (t < 1 / 2)
            return q;
        if (t < 2 / 3)
            return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    }
    function hslaToRgba({ hue, saturation, lightness, alpha }) {
        hue /= 360;
        saturation /= 100;
        lightness /= 100;
        let red = 0;
        let green = 0;
        let blue = 0;
        if (!saturation) {
            red = green = blue = lightness;
        }
        else {
            const q = lightness < 0.5
                ? lightness * (1 + saturation)
                : lightness + saturation - lightness * saturation;
            const p = 2 * lightness - q;
            red = hueToRgb(p, q, hue + 1 / 3);
            green = hueToRgb(p, q, hue);
            blue = hueToRgb(p, q, hue - 1 / 3);
        }
        return {
            red: Math.round(red * 255),
            green: Math.round(green * 255),
            blue: Math.round(blue * 255),
            alpha,
        };
    }

    const mixLinearColor = (from, to, v) => {
        const fromExpo = from * from;
        const toExpo = to * to;
        return Math.sqrt(Math.max(0, v * (toExpo - fromExpo) + fromExpo));
    };
    const colorTypes = [hex, rgba, hsla];
    const getColorType = (v) => colorTypes.find((type) => type.test(v));
    const notAnimatable = (color) => `'${color}' is not an animatable color. Use the equivalent color code instead.`;
    const mixColor = (from, to) => {
        let fromColorType = getColorType(from);
        let toColorType = getColorType(to);
        invariant(!!fromColorType, notAnimatable(from));
        invariant(!!toColorType, notAnimatable(to));
        let fromColor = fromColorType.parse(from);
        let toColor = toColorType.parse(to);
        if (fromColorType === hsla) {
            fromColor = hslaToRgba(fromColor);
            fromColorType = rgba;
        }
        if (toColorType === hsla) {
            toColor = hslaToRgba(toColor);
            toColorType = rgba;
        }
        const blended = Object.assign({}, fromColor);
        return (v) => {
            for (const key in blended) {
                if (key !== "alpha") {
                    blended[key] = mixLinearColor(fromColor[key], toColor[key], v);
                }
            }
            blended.alpha = mix(fromColor.alpha, toColor.alpha, v);
            return fromColorType.transform(blended);
        };
    };

    const isNum = (v) => typeof v === 'number';

    const combineFunctions = (a, b) => (v) => b(a(v));
    const pipe = (...transformers) => transformers.reduce(combineFunctions);

    function getMixer(origin, target) {
        if (isNum(origin)) {
            return (v) => mix(origin, target, v);
        }
        else if (color.test(origin)) {
            return mixColor(origin, target);
        }
        else {
            return mixComplex(origin, target);
        }
    }
    const mixArray = (from, to) => {
        const output = [...from];
        const numValues = output.length;
        const blendValue = from.map((fromThis, i) => getMixer(fromThis, to[i]));
        return (v) => {
            for (let i = 0; i < numValues; i++) {
                output[i] = blendValue[i](v);
            }
            return output;
        };
    };
    const mixObject = (origin, target) => {
        const output = Object.assign(Object.assign({}, origin), target);
        const blendValue = {};
        for (const key in output) {
            if (origin[key] !== undefined && target[key] !== undefined) {
                blendValue[key] = getMixer(origin[key], target[key]);
            }
        }
        return (v) => {
            for (const key in blendValue) {
                output[key] = blendValue[key](v);
            }
            return output;
        };
    };
    function analyse(value) {
        const parsed = complex.parse(value);
        const numValues = parsed.length;
        let numNumbers = 0;
        let numRGB = 0;
        let numHSL = 0;
        for (let i = 0; i < numValues; i++) {
            if (numNumbers || typeof parsed[i] === "number") {
                numNumbers++;
            }
            else {
                if (parsed[i].hue !== undefined) {
                    numHSL++;
                }
                else {
                    numRGB++;
                }
            }
        }
        return { parsed, numNumbers, numRGB, numHSL };
    }
    const mixComplex = (origin, target) => {
        const template = complex.createTransformer(target);
        const originStats = analyse(origin);
        const targetStats = analyse(target);
        const canInterpolate = originStats.numHSL === targetStats.numHSL &&
            originStats.numRGB === targetStats.numRGB &&
            originStats.numNumbers >= targetStats.numNumbers;
        if (canInterpolate) {
            return pipe(mixArray(originStats.parsed, targetStats.parsed), template);
        }
        else {
            warning(true, `Complex values '${origin}' and '${target}' too different to mix. Ensure all colors are of the same type, and that each contains the same quantity of number and color values. Falling back to instant transition.`);
            return (p) => `${p > 0 ? target : origin}`;
        }
    };

    const mixNumber = (from, to) => (p) => mix(from, to, p);
    function detectMixerFactory(v) {
        if (typeof v === 'number') {
            return mixNumber;
        }
        else if (typeof v === 'string') {
            if (color.test(v)) {
                return mixColor;
            }
            else {
                return mixComplex;
            }
        }
        else if (Array.isArray(v)) {
            return mixArray;
        }
        else if (typeof v === 'object') {
            return mixObject;
        }
    }
    function createMixers(output, ease, customMixer) {
        const mixers = [];
        const mixerFactory = customMixer || detectMixerFactory(output[0]);
        const numMixers = output.length - 1;
        for (let i = 0; i < numMixers; i++) {
            let mixer = mixerFactory(output[i], output[i + 1]);
            if (ease) {
                const easingFunction = Array.isArray(ease) ? ease[i] : ease;
                mixer = pipe(easingFunction, mixer);
            }
            mixers.push(mixer);
        }
        return mixers;
    }
    function fastInterpolate([from, to], [mixer]) {
        return (v) => mixer(progress(from, to, v));
    }
    function slowInterpolate(input, mixers) {
        const inputLength = input.length;
        const lastInputIndex = inputLength - 1;
        return (v) => {
            let mixerIndex = 0;
            let foundMixerIndex = false;
            if (v <= input[0]) {
                foundMixerIndex = true;
            }
            else if (v >= input[lastInputIndex]) {
                mixerIndex = lastInputIndex - 1;
                foundMixerIndex = true;
            }
            if (!foundMixerIndex) {
                let i = 1;
                for (; i < inputLength; i++) {
                    if (input[i] > v || i === lastInputIndex) {
                        break;
                    }
                }
                mixerIndex = i - 1;
            }
            const progressInRange = progress(input[mixerIndex], input[mixerIndex + 1], v);
            return mixers[mixerIndex](progressInRange);
        };
    }
    function interpolate(input, output, { clamp: isClamp = true, ease, mixer } = {}) {
        const inputLength = input.length;
        invariant(inputLength === output.length, 'Both input and output ranges must be the same length');
        invariant(!ease || !Array.isArray(ease) || ease.length === inputLength - 1, 'Array of easing functions must be of length `input.length - 1`, as it applies to the transitions **between** the defined values.');
        if (input[0] > input[inputLength - 1]) {
            input = [].concat(input);
            output = [].concat(output);
            input.reverse();
            output.reverse();
        }
        const mixers = createMixers(output, ease, mixer);
        const interpolator = inputLength === 2
            ? fastInterpolate(input, mixers)
            : slowInterpolate(input, mixers);
        return isClamp
            ? (v) => interpolator(clamp$1(input[0], input[inputLength - 1], v))
            : interpolator;
    }

    const reverseEasing = easing => p => 1 - easing(1 - p);
    const mirrorEasing = easing => p => p <= 0.5 ? easing(2 * p) / 2 : (2 - easing(2 * (1 - p))) / 2;
    const createExpoIn = (power) => p => Math.pow(p, power);
    const createBackIn = (power) => p => p * p * ((power + 1) * p - power);
    const createAnticipate = (power) => {
        const backEasing = createBackIn(power);
        return p => (p *= 2) < 1
            ? 0.5 * backEasing(p)
            : 0.5 * (2 - Math.pow(2, -10 * (p - 1)));
    };

    const DEFAULT_OVERSHOOT_STRENGTH = 1.525;
    const BOUNCE_FIRST_THRESHOLD = 4.0 / 11.0;
    const BOUNCE_SECOND_THRESHOLD = 8.0 / 11.0;
    const BOUNCE_THIRD_THRESHOLD = 9.0 / 10.0;
    const linear = p => p;
    const easeIn = createExpoIn(2);
    const easeOut = reverseEasing(easeIn);
    const easeInOut = mirrorEasing(easeIn);
    const circIn = p => 1 - Math.sin(Math.acos(p));
    const circOut = reverseEasing(circIn);
    const circInOut = mirrorEasing(circOut);
    const backIn = createBackIn(DEFAULT_OVERSHOOT_STRENGTH);
    const backOut = reverseEasing(backIn);
    const backInOut = mirrorEasing(backIn);
    const anticipate = createAnticipate(DEFAULT_OVERSHOOT_STRENGTH);
    const ca = 4356.0 / 361.0;
    const cb = 35442.0 / 1805.0;
    const cc = 16061.0 / 1805.0;
    const bounceOut = (p) => {
        if (p === 1 || p === 0)
            return p;
        const p2 = p * p;
        return p < BOUNCE_FIRST_THRESHOLD
            ? 7.5625 * p2
            : p < BOUNCE_SECOND_THRESHOLD
                ? 9.075 * p2 - 9.9 * p + 3.4
                : p < BOUNCE_THIRD_THRESHOLD
                    ? ca * p2 - cb * p + cc
                    : 10.8 * p * p - 20.52 * p + 10.72;
    };
    const bounceIn = reverseEasing(bounceOut);
    const bounceInOut = (p) => p < 0.5
        ? 0.5 * (1.0 - bounceOut(1.0 - p * 2.0))
        : 0.5 * bounceOut(p * 2.0 - 1.0) + 0.5;

    function defaultEasing(values, easing) {
        return values.map(() => easing || easeInOut).splice(0, values.length - 1);
    }
    function defaultOffset(values) {
        const numValues = values.length;
        return values.map((_value, i) => i !== 0 ? i / (numValues - 1) : 0);
    }
    function convertOffsetToTimes(offset, duration) {
        return offset.map((o) => o * duration);
    }
    function keyframes$1({ from = 0, to = 1, ease, offset, duration = 300, }) {
        const state = { done: false, value: from };
        const values = Array.isArray(to) ? to : [from, to];
        const times = convertOffsetToTimes(offset && offset.length === values.length
            ? offset
            : defaultOffset(values), duration);
        function createInterpolator() {
            return interpolate(times, values, {
                ease: Array.isArray(ease) ? ease : defaultEasing(values, ease),
            });
        }
        let interpolator = createInterpolator();
        return {
            next: (t) => {
                state.value = interpolator(t);
                state.done = t >= duration;
                return state;
            },
            flipTarget: () => {
                values.reverse();
                interpolator = createInterpolator();
            },
        };
    }

    function decay({ velocity = 0, from = 0, power = 0.8, timeConstant = 350, restDelta = 0.5, modifyTarget, }) {
        const state = { done: false, value: from };
        let amplitude = power * velocity;
        const ideal = from + amplitude;
        const target = modifyTarget === undefined ? ideal : modifyTarget(ideal);
        if (target !== ideal)
            amplitude = target - from;
        return {
            next: (t) => {
                const delta = -amplitude * Math.exp(-t / timeConstant);
                state.done = !(delta > restDelta || delta < -restDelta);
                state.value = state.done ? target : target + delta;
                return state;
            },
            flipTarget: () => { },
        };
    }

    const types = { keyframes: keyframes$1, spring, decay };
    function detectAnimationFromOptions(config) {
        if (Array.isArray(config.to)) {
            return keyframes$1;
        }
        else if (types[config.type]) {
            return types[config.type];
        }
        const keys = new Set(Object.keys(config));
        if (keys.has("ease") ||
            (keys.has("duration") && !keys.has("dampingRatio"))) {
            return keyframes$1;
        }
        else if (keys.has("dampingRatio") ||
            keys.has("stiffness") ||
            keys.has("mass") ||
            keys.has("damping") ||
            keys.has("restSpeed") ||
            keys.has("restDelta")) {
            return spring;
        }
        return keyframes$1;
    }

    function loopElapsed(elapsed, duration, delay = 0) {
        return elapsed - duration - delay;
    }
    function reverseElapsed(elapsed, duration, delay = 0, isForwardPlayback = true) {
        return isForwardPlayback
            ? loopElapsed(duration + -elapsed, duration, delay)
            : duration - (elapsed - duration) + delay;
    }
    function hasRepeatDelayElapsed(elapsed, duration, delay, isForwardPlayback) {
        return isForwardPlayback ? elapsed >= duration + delay : elapsed <= -delay;
    }

    const framesync = (update) => {
        const passTimestamp = ({ delta }) => update(delta);
        return {
            start: () => sync.update(passTimestamp, true),
            stop: () => cancelSync.update(passTimestamp),
        };
    };
    function animate(_a) {
        var _b, _c;
        var { from, autoplay = true, driver = framesync, elapsed = 0, repeat: repeatMax = 0, repeatType = "loop", repeatDelay = 0, onPlay, onStop, onComplete, onRepeat, onUpdate } = _a, options = __rest$1(_a, ["from", "autoplay", "driver", "elapsed", "repeat", "repeatType", "repeatDelay", "onPlay", "onStop", "onComplete", "onRepeat", "onUpdate"]);
        let { to } = options;
        let driverControls;
        let repeatCount = 0;
        let computedDuration = options.duration;
        let latest;
        let isComplete = false;
        let isForwardPlayback = true;
        let interpolateFromNumber;
        const animator = detectAnimationFromOptions(options);
        if ((_c = (_b = animator).needsInterpolation) === null || _c === void 0 ? void 0 : _c.call(_b, from, to)) {
            interpolateFromNumber = interpolate([0, 100], [from, to], {
                clamp: false,
            });
            from = 0;
            to = 100;
        }
        const animation = animator(Object.assign(Object.assign({}, options), { from, to }));
        function repeat() {
            repeatCount++;
            if (repeatType === "reverse") {
                isForwardPlayback = repeatCount % 2 === 0;
                elapsed = reverseElapsed(elapsed, computedDuration, repeatDelay, isForwardPlayback);
            }
            else {
                elapsed = loopElapsed(elapsed, computedDuration, repeatDelay);
                if (repeatType === "mirror")
                    animation.flipTarget();
            }
            isComplete = false;
            onRepeat && onRepeat();
        }
        function complete() {
            driverControls.stop();
            onComplete && onComplete();
        }
        function update(delta) {
            if (!isForwardPlayback)
                delta = -delta;
            elapsed += delta;
            if (!isComplete) {
                const state = animation.next(Math.max(0, elapsed));
                latest = state.value;
                if (interpolateFromNumber)
                    latest = interpolateFromNumber(latest);
                isComplete = isForwardPlayback ? state.done : elapsed <= 0;
            }
            onUpdate === null || onUpdate === void 0 ? void 0 : onUpdate(latest);
            if (isComplete) {
                if (repeatCount === 0)
                    computedDuration !== null && computedDuration !== void 0 ? computedDuration : (computedDuration = elapsed);
                if (repeatCount < repeatMax) {
                    hasRepeatDelayElapsed(elapsed, computedDuration, repeatDelay, isForwardPlayback) && repeat();
                }
                else {
                    complete();
                }
            }
        }
        function play() {
            onPlay === null || onPlay === void 0 ? void 0 : onPlay();
            driverControls = driver(update);
            driverControls.start();
        }
        autoplay && play();
        return {
            stop: () => {
                onStop === null || onStop === void 0 ? void 0 : onStop();
                driverControls.stop();
            },
        };
    }

    function velocityPerSecond(velocity, frameDuration) {
        return frameDuration ? velocity * (1000 / frameDuration) : 0;
    }

    function inertia({ from = 0, velocity = 0, min, max, power = 0.8, timeConstant = 750, bounceStiffness = 500, bounceDamping = 10, restDelta = 1, modifyTarget, driver, onUpdate, onComplete, onStop, }) {
        let currentAnimation;
        function isOutOfBounds(v) {
            return (min !== undefined && v < min) || (max !== undefined && v > max);
        }
        function boundaryNearest(v) {
            if (min === undefined)
                return max;
            if (max === undefined)
                return min;
            return Math.abs(min - v) < Math.abs(max - v) ? min : max;
        }
        function startAnimation(options) {
            currentAnimation === null || currentAnimation === void 0 ? void 0 : currentAnimation.stop();
            currentAnimation = animate(Object.assign(Object.assign({}, options), { driver, onUpdate: (v) => {
                    var _a;
                    onUpdate === null || onUpdate === void 0 ? void 0 : onUpdate(v);
                    (_a = options.onUpdate) === null || _a === void 0 ? void 0 : _a.call(options, v);
                }, onComplete,
                onStop }));
        }
        function startSpring(options) {
            startAnimation(Object.assign({ type: "spring", stiffness: bounceStiffness, damping: bounceDamping, restDelta }, options));
        }
        if (isOutOfBounds(from)) {
            startSpring({ from, velocity, to: boundaryNearest(from) });
        }
        else {
            let target = power * velocity + from;
            if (typeof modifyTarget !== "undefined")
                target = modifyTarget(target);
            const boundary = boundaryNearest(target);
            const heading = boundary === min ? -1 : 1;
            let prev;
            let current;
            const checkBoundary = (v) => {
                prev = current;
                current = v;
                velocity = velocityPerSecond(v - prev, getFrameData().delta);
                if ((heading === 1 && v > boundary) ||
                    (heading === -1 && v < boundary)) {
                    startSpring({ from: v, to: boundary, velocity });
                }
            };
            startAnimation({
                type: "decay",
                from,
                velocity,
                timeConstant,
                power,
                restDelta,
                modifyTarget,
                onUpdate: isOutOfBounds(target) ? checkBoundary : undefined,
            });
        }
        return {
            stop: () => currentAnimation === null || currentAnimation === void 0 ? void 0 : currentAnimation.stop(),
        };
    }

    const isPoint = (point) => point.hasOwnProperty('x') && point.hasOwnProperty('y');

    const isPoint3D = (point) => isPoint(point) && point.hasOwnProperty('z');

    const distance1D = (a, b) => Math.abs(a - b);
    function distance(a, b) {
        if (isNum(a) && isNum(b)) {
            return distance1D(a, b);
        }
        else if (isPoint(a) && isPoint(b)) {
            const xDelta = distance1D(a.x, b.x);
            const yDelta = distance1D(a.y, b.y);
            const zDelta = isPoint3D(a) && isPoint3D(b) ? distance1D(a.z, b.z) : 0;
            return Math.sqrt(Math.pow(xDelta, 2) + Math.pow(yDelta, 2) + Math.pow(zDelta, 2));
        }
    }

    const a = (a1, a2) => 1.0 - 3.0 * a2 + 3.0 * a1;
    const b = (a1, a2) => 3.0 * a2 - 6.0 * a1;
    const c = (a1) => 3.0 * a1;
    const calcBezier = (t, a1, a2) => ((a(a1, a2) * t + b(a1, a2)) * t + c(a1)) * t;
    const getSlope = (t, a1, a2) => 3.0 * a(a1, a2) * t * t + 2.0 * b(a1, a2) * t + c(a1);
    const subdivisionPrecision = 0.0000001;
    const subdivisionMaxIterations = 10;
    function binarySubdivide(aX, aA, aB, mX1, mX2) {
        let currentX;
        let currentT;
        let i = 0;
        do {
            currentT = aA + (aB - aA) / 2.0;
            currentX = calcBezier(currentT, mX1, mX2) - aX;
            if (currentX > 0.0) {
                aB = currentT;
            }
            else {
                aA = currentT;
            }
        } while (Math.abs(currentX) > subdivisionPrecision &&
            ++i < subdivisionMaxIterations);
        return currentT;
    }
    const newtonIterations = 8;
    const newtonMinSlope = 0.001;
    function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
        for (let i = 0; i < newtonIterations; ++i) {
            const currentSlope = getSlope(aGuessT, mX1, mX2);
            if (currentSlope === 0.0) {
                return aGuessT;
            }
            const currentX = calcBezier(aGuessT, mX1, mX2) - aX;
            aGuessT -= currentX / currentSlope;
        }
        return aGuessT;
    }
    const kSplineTableSize = 11;
    const kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);
    function cubicBezier(mX1, mY1, mX2, mY2) {
        if (mX1 === mY1 && mX2 === mY2)
            return linear;
        const sampleValues = new Float32Array(kSplineTableSize);
        for (let i = 0; i < kSplineTableSize; ++i) {
            sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
        }
        function getTForX(aX) {
            let intervalStart = 0.0;
            let currentSample = 1;
            const lastSample = kSplineTableSize - 1;
            for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
                intervalStart += kSampleStepSize;
            }
            --currentSample;
            const dist = (aX - sampleValues[currentSample]) /
                (sampleValues[currentSample + 1] - sampleValues[currentSample]);
            const guessForT = intervalStart + dist * kSampleStepSize;
            const initialSlope = getSlope(guessForT, mX1, mX2);
            if (initialSlope >= newtonMinSlope) {
                return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
            }
            else if (initialSlope === 0.0) {
                return guessForT;
            }
            else {
                return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
            }
        }
        return (t) => t === 0 || t === 1 ? t : calcBezier(getTForX(t), mY1, mY2);
    }

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */
    function addUniqueItem(arr, item) {
        arr.indexOf(item) === -1 && arr.push(item);
    }
    function removeItem(arr, item) {
        var index = arr.indexOf(item);
        index > -1 && arr.splice(index, 1);
    }

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    var SubscriptionManager = /** @class */ (function () {
        function SubscriptionManager() {
            this.subscriptions = [];
        }
        SubscriptionManager.prototype.add = function (handler) {
            var _this = this;
            addUniqueItem(this.subscriptions, handler);
            return function () { return removeItem(_this.subscriptions, handler); };
        };
        SubscriptionManager.prototype.notify = function (a, b, c) {
            var numSubscriptions = this.subscriptions.length;
            if (!numSubscriptions)
                return;
            if (numSubscriptions === 1) {
                /**
                 * If there's only a single handler we can just call it without invoking a loop.
                 */
                this.subscriptions[0](a, b, c);
            }
            else {
                for (var i = 0; i < numSubscriptions; i++) {
                    /**
                     * Check whether the handler exists before firing as it's possible
                     * the subscriptions were modified during this loop running.
                     */
                    var handler = this.subscriptions[i];
                    handler && handler(a, b, c);
                }
            }
        };
        SubscriptionManager.prototype.getSize = function () {
            return this.subscriptions.length;
        };
        SubscriptionManager.prototype.clear = function () {
            this.subscriptions.length = 0;
        };
        return SubscriptionManager;
    }());

    var isFloat = function (value) {
        return !isNaN(parseFloat(value));
    };
    /**
     * `MotionValue` is used to track the state and velocity of motion values.
     *
     * @public
     */
    var MotionValue = /** @class */ (function () {
        /**
         * @param init - The initiating value
         * @param config - Optional configuration options
         *
         * -  `transformer`: A function to transform incoming values with.
         *
         * @internal
         */
        function MotionValue(init, startStopNotifier) {
            var _this = this;
            /**
             * Duration, in milliseconds, since last updating frame.
             *
             * @internal
             */
            this.timeDelta = 0;
            /**
             * Timestamp of the last time this `MotionValue` was updated.
             *
             * @internal
             */
            this.lastUpdated = 0;
            /**
             * Functions to notify when the `MotionValue` updates.
             *
             * @internal
             */
            this.updateSubscribers = new SubscriptionManager();
            /**
             * Functions to notify when the velocity updates.
             *
             * @internal
             */
            this.velocityUpdateSubscribers = new SubscriptionManager();
            /**
             * Functions to notify when the `MotionValue` updates and `render` is set to `true`.
             *
             * @internal
             */
            this.renderSubscribers = new SubscriptionManager();
            /**
             * Tracks whether this value can output a velocity. Currently this is only true
             * if the value is numerical, but we might be able to widen the scope here and support
             * other value types.
             *
             * @internal
             */
            this.canTrackVelocity = false;
            this.updateAndNotify = function (v, render) {
                if (render === void 0) { render = true; }
                _this.prev = _this.current;
                _this.current = v;
                // Update timestamp
                var _a = getFrameData(), delta = _a.delta, timestamp = _a.timestamp;
                if (_this.lastUpdated !== timestamp) {
                    _this.timeDelta = delta;
                    _this.lastUpdated = timestamp;
                    sync.postRender(_this.scheduleVelocityCheck);
                }
                // Update update subscribers
                if (_this.prev !== _this.current) {
                    _this.updateSubscribers.notify(_this.current);
                }
                // Update velocity subscribers
                if (_this.velocityUpdateSubscribers.getSize()) {
                    _this.velocityUpdateSubscribers.notify(_this.getVelocity());
                }
                // Update render subscribers
                if (render) {
                    _this.renderSubscribers.notify(_this.current);
                }
            };
            /**
             * Schedule a velocity check for the next frame.
             *
             * This is an instanced and bound function to prevent generating a new
             * function once per frame.
             *
             * @internal
             */
            this.scheduleVelocityCheck = function () { return sync.postRender(_this.velocityCheck); };
            /**
             * Updates `prev` with `current` if the value hasn't been updated this frame.
             * This ensures velocity calculations return `0`.
             *
             * This is an instanced and bound function to prevent generating a new
             * function once per frame.
             *
             * @internal
             */
            this.velocityCheck = function (_a) {
                var timestamp = _a.timestamp;
                if (timestamp !== _this.lastUpdated) {
                    _this.prev = _this.current;
                    _this.velocityUpdateSubscribers.notify(_this.getVelocity());
                }
            };
            this.hasAnimated = false;
            this.prev = this.current = init;
            this.canTrackVelocity = isFloat(this.current);
            this.onSubscription = () => { };
            this.onUnsubscription = () => { };
            if (startStopNotifier) {
                this.onSubscription = () => {
                    if (this.updateSubscribers.getSize() + this.velocityUpdateSubscribers.getSize() + this.renderSubscribers.getSize() === 0) {

                        const unsub = startStopNotifier();
                        this.onUnsubscription = () => { };
                        if (unsub) {
                            this.onUnsubscription = () => {
                                if (this.updateSubscribers.getSize() + this.velocityUpdateSubscribers.getSize() + this.renderSubscribers.getSize() === 0) {
                                    unsub();
                                }
                            };
                        }

                    }
                };
            }
        }
        /**
         * Adds a function that will be notified when the `MotionValue` is updated.
         *
         * It returns a function that, when called, will cancel the subscription.
         *
         * When calling `onChange` inside a React component, it should be wrapped with the
         * `useEffect` hook. As it returns an unsubscribe function, this should be returned
         * from the `useEffect` function to ensure you don't add duplicate subscribers..
         *
         * @motion
         *
         * ```jsx
         * export const MyComponent = () => {
         *   const x = useMotionValue(0)
         *   const y = useMotionValue(0)
         *   const opacity = useMotionValue(1)
         *
         *   useEffect(() => {
         *     function updateOpacity() {
         *       const maxXY = Math.max(x.get(), y.get())
         *       const newOpacity = transform(maxXY, [0, 100], [1, 0])
         *       opacity.set(newOpacity)
         *     }
         *
         *     const unsubscribeX = x.onChange(updateOpacity)
         *     const unsubscribeY = y.onChange(updateOpacity)
         *
         *     return () => {
         *       unsubscribeX()
         *       unsubscribeY()
         *     }
         *   }, [])
         *
         *   return <MotionDiv style={{ x }} />
         * }
         * ```
         *
         * @internalremarks
         *
         * We could look into a `useOnChange` hook if the above lifecycle management proves confusing.
         *
         * ```jsx
         * useOnChange(x, () => {})
         * ```
         *
         * @param subscriber - A function that receives the latest value.
         * @returns A function that, when called, will cancel this subscription.
         *
         * @public
         */
        MotionValue.prototype.onChange = function (subscription) {
            this.onSubscription();
            const unsub = this.updateSubscribers.add(subscription);
            return () => {
                unsub();
                this.onUnsubscription();

            }
        };
        /** Add subscribe method for Svelte store interface */
        MotionValue.prototype.subscribe = function (subscription) {
            return this.onChange(subscription);
        };

        MotionValue.prototype.clearListeners = function () {
            this.updateSubscribers.clear();
            this.onUnsubscription();
        };
        /**
         * Adds a function that will be notified when the `MotionValue` requests a render.
         *
         * @param subscriber - A function that's provided the latest value.
         * @returns A function that, when called, will cancel this subscription.
         *
         * @internal
         */
        MotionValue.prototype.onRenderRequest = function (subscription) {
            this.onSubscription();
            // Render immediately
            subscription(this.get());
            const unsub = this.renderSubscribers.add(subscription);
            return () => {
                unsub();
                this.onUnsubscription();
            }
        };
        /**
         * Attaches a passive effect to the `MotionValue`.
         *
         * @internal
         */
        MotionValue.prototype.attach = function (passiveEffect) {
            this.passiveEffect = passiveEffect;
        };
        /**
         * Sets the state of the `MotionValue`.
         *
         * @remarks
         *
         * ```jsx
         * const x = useMotionValue(0)
         * x.set(10)
         * ```
         *
         * @param latest - Latest value to set.
         * @param render - Whether to notify render subscribers. Defaults to `true`
         *
         * @public
         */
        MotionValue.prototype.set = function (v, render) {
            if (render === void 0) { render = true; }
            if (!render || !this.passiveEffect) {
                this.updateAndNotify(v, render);
            }
            else {
                this.passiveEffect(v, this.updateAndNotify);
            }
        };
        /** Add update method for Svelte Store behavior */
        MotionValue.prototype.update = function (v) {
            this.set(v(this.get()));
        };
        /**
         * Returns the latest state of `MotionValue`
         *
         * @returns - The latest state of `MotionValue`
         *
         * @public
         */
        MotionValue.prototype.get = function () {
            this.onSubscription();
            const curr = this.current;
            this.onUnsubscription();
            return curr
        };
        /**
         * @public
         */
        MotionValue.prototype.getPrevious = function () {
            return this.prev;
        };
        /**
         * Returns the latest velocity of `MotionValue`
         *
         * @returns - The latest velocity of `MotionValue`. Returns `0` if the state is non-numerical.
         *
         * @public
         */
        MotionValue.prototype.getVelocity = function () {
            // This could be isFloat(this.prev) && isFloat(this.current), but that would be wasteful
            this.onSubscription();
            const vel = this.canTrackVelocity
                ? // These casts could be avoided if parseFloat would be typed better
                velocityPerSecond(parseFloat(this.current) -
                    parseFloat(this.prev), this.timeDelta)
                : 0;
            this.onUnsubscription();
            return vel;
        };
        /**
         * Registers a new animation to control this `MotionValue`. Only one
         * animation can drive a `MotionValue` at one time.
         *
         * ```jsx
         * value.start()
         * ```
         *
         * @param animation - A function that starts the provided animation
         *
         * @internal
         */
        MotionValue.prototype.start = function (animation) {
            var _this = this;
            this.stop();
            return new Promise(function (resolve) {
                _this.hasAnimated = true;
                _this.stopAnimation = animation(resolve);
            }).then(function () { return _this.clearAnimation(); });
        };
        /**
         * Stop the currently active animation.
         *
         * @public
         */
        MotionValue.prototype.stop = function () {
            if (this.stopAnimation)
                this.stopAnimation();
            this.clearAnimation();
        };
        /**
         * Returns `true` if this value is currently animating.
         *
         * @public
         */
        MotionValue.prototype.isAnimating = function () {
            return !!this.stopAnimation;
        };
        MotionValue.prototype.clearAnimation = function () {
            this.stopAnimation = null;
        };
        /**
         * Destroy and clean up subscribers to this `MotionValue`.
         *
         * The `MotionValue` hooks like `useMotionValue` and `useTransform` automatically
         * handle the lifecycle of the returned `MotionValue`, so this method is only necessary if you've manually
         * created a `MotionValue` via the `motionValue` function.
         *
         * @public
         */
        MotionValue.prototype.destroy = function () {
            this.updateSubscribers.clear();
            this.renderSubscribers.clear();
            this.stop();
            this.onUnsubscription();
        };
        return MotionValue;
    }());
    /**
     * @internal
     */
    function motionValue(init, startStopNotifier) {
        return new MotionValue(init, startStopNotifier);
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop$1) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop$1) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop$1;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop$1;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop$1;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const getDomContext = (name,el) => {
        if (!el || !window){
            return undefined;
        }
        let par = el;
        while(par = par.parentNode){
            if (par.motionDomContext && par.motionDomContext.has(name)){
                return par.motionDomContext.get(name)
            }
        }
        return undefined;
    };

    const setDomContext = (name,el,value) => {
        if (el && window){
            if (!el.motionDomContext){
                el.motionDomContext = new Map();
            }
            el.motionDomContext.set(name,value);
        }
    };

    /**
     * @public
     */
    var MotionConfigContext = (c)=> getDomContext("MotionConfig",c)||writable({
        transformPagePoint: function (p) { return p; },
        isStatic: false,
    });

    /* node_modules\svelte-motion\src\context\ScaleCorrectionProvider.svelte generated by Svelte v3.55.1 */

    function create_fragment$p(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const ScaleCorrectionContext = isCustom => getDomContext("ScaleCorrection", isCustom) || writable([]);
    const ScaleCorrectionParentContext = () => writable([]);

    const provideScaleCorrection = isCustom => {
    	const fromParent = getContext(ScaleCorrectionContext) || ScaleCorrectionContext(isCustom);
    	const ctx = ScaleCorrectionContext();
    	setContext(ScaleCorrectionContext, ctx);
    	setDomContext("ScaleCorrection", isCustom, ctx);
    	setContext(ScaleCorrectionParentContext, fromParent);
    };

    function instance$p($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ScaleCorrectionProvider', slots, ['default']);
    	let { isCustom } = $$props;
    	provideScaleCorrection(isCustom);

    	$$self.$$.on_mount.push(function () {
    		if (isCustom === undefined && !('isCustom' in $$props || $$self.$$.bound[$$self.$$.props['isCustom']])) {
    			console.warn("<ScaleCorrectionProvider> was created without expected prop 'isCustom'");
    		}
    	});

    	const writable_props = ['isCustom'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ScaleCorrectionProvider> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('isCustom' in $$props) $$invalidate(0, isCustom = $$props.isCustom);
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		writable,
    		getContext,
    		setContext,
    		getDomContext,
    		setDomContext,
    		ScaleCorrectionContext,
    		ScaleCorrectionParentContext,
    		provideScaleCorrection,
    		isCustom
    	});

    	$$self.$inject_state = $$props => {
    		if ('isCustom' in $$props) $$invalidate(0, isCustom = $$props.isCustom);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [isCustom, $$scope, slots];
    }

    class ScaleCorrectionProvider extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, { isCustom: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ScaleCorrectionProvider",
    			options,
    			id: create_fragment$p.name
    		});
    	}

    	get isCustom() {
    		throw new Error("<ScaleCorrectionProvider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isCustom(value) {
    		throw new Error("<ScaleCorrectionProvider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var ScaleCorrectionProvider$1 = ScaleCorrectionProvider;

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    }

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */
    /**
     * Converts seconds to milliseconds
     *
     * @param seconds - Time in seconds.
     * @return milliseconds - Converted time in milliseconds.
     */
    var secondsToMilliseconds = function (seconds) { return seconds * 1000; };

    //import { invariant } from 'hey-listen';

    var easingLookup = {
        linear: linear,
        easeIn: easeIn,
        easeInOut: easeInOut,
        easeOut: easeOut,
        circIn: circIn,
        circInOut: circInOut,
        circOut: circOut,
        backIn: backIn,
        backInOut: backInOut,
        backOut: backOut,
        anticipate: anticipate,
        bounceIn: bounceIn,
        bounceInOut: bounceInOut,
        bounceOut: bounceOut,
    };
    var easingDefinitionToFunction = function (definition) {
        if (Array.isArray(definition)) {
            // If cubic bezier definition, create bezier curve
            //invariant(definition.length === 4, "Cubic bezier arrays must contain four numerical values.");
            var _a = __read(definition, 4), x1 = _a[0], y1 = _a[1], x2 = _a[2], y2 = _a[3];
            return cubicBezier(x1, y1, x2, y2);
        }
        else if (typeof definition === "string") {
            // Else lookup from table
            //invariant(easingLookup[definition] !== undefined, "Invalid easing type '" + definition + "'");
            return easingLookup[definition];
        }
        return definition;
    };
    var isEasingArray = function (ease) {
        return Array.isArray(ease) && typeof ease[0] !== "number";
    };

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    /**
     * Check if a value is animatable. Examples:
     *
     * ✅: 100, "100px", "#fff"
     * ❌: "block", "url(2.jpg)"
     * @param value
     *
     * @internal
     */
    var isAnimatable = function (key, value) {
        // If the list of keys tat might be non-animatable grows, replace with Set
        if (key === "zIndex")
            return false;
        // If it's a number or a keyframes array, we can animate it. We might at some point
        // need to do a deep isAnimatable check of keyframes, or let Popmotion handle this,
        // but for now lets leave it like this for performance reasons
        if (typeof value === "number" || Array.isArray(value))
            return true;
        if (typeof value === "string" && // It's animatable if we have a string
            complex.test(value) && // And it contains numbers and/or colors
            !value.startsWith("url(") // Unless it starts with "url("
        ) {
            return true;
        }
        return false;
    };

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    var isKeyframesTarget = function (v) {
        return Array.isArray(v);
    };

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    var underDampedSpring = function () { return ({
        type: "spring",
        stiffness: 500,
        damping: 25,
        restDelta: 0.5,
        restSpeed: 10,
    }); };
    var criticallyDampedSpring = function (to) { return ({
        type: "spring",
        stiffness: 550,
        damping: to === 0 ? 2 * Math.sqrt(550) : 30,
        restDelta: 0.01,
        restSpeed: 10,
    }); };
    var linearTween = function () { return ({
        type: "keyframes",
        ease: "linear",
        duration: 0.3,
    }); };
    var keyframes = function (values) { return ({
        type: "keyframes",
        duration: 0.8,
        values: values,
    }); };
    var defaultTransitions = {
        x: underDampedSpring,
        y: underDampedSpring,
        z: underDampedSpring,
        rotate: underDampedSpring,
        rotateX: underDampedSpring,
        rotateY: underDampedSpring,
        rotateZ: underDampedSpring,
        scaleX: criticallyDampedSpring,
        scaleY: criticallyDampedSpring,
        scale: criticallyDampedSpring,
        opacity: linearTween,
        backgroundColor: linearTween,
        color: linearTween,
        default: criticallyDampedSpring,
    };
    var getDefaultTransition = function (valueKey, to) {
        var transitionFactory;
        if (isKeyframesTarget(to)) {
            transitionFactory = keyframes;
        }
        else {
            transitionFactory =
                defaultTransitions[valueKey] || defaultTransitions.default;
        }
        return __assign({ to: to }, transitionFactory(to));
    };

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    var int = __assign(__assign({}, number), { transform: Math.round });

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    var numberValueTypes = {
        // Border props
        borderWidth: px,
        borderTopWidth: px,
        borderRightWidth: px,
        borderBottomWidth: px,
        borderLeftWidth: px,
        borderRadius: px,
        radius: px,
        borderTopLeftRadius: px,
        borderTopRightRadius: px,
        borderBottomRightRadius: px,
        borderBottomLeftRadius: px,
        // Positioning props
        width: px,
        maxWidth: px,
        height: px,
        maxHeight: px,
        size: px,
        top: px,
        right: px,
        bottom: px,
        left: px,
        // Spacing props
        padding: px,
        paddingTop: px,
        paddingRight: px,
        paddingBottom: px,
        paddingLeft: px,
        margin: px,
        marginTop: px,
        marginRight: px,
        marginBottom: px,
        marginLeft: px,
        // Transform props
        rotate: degrees,
        rotateX: degrees,
        rotateY: degrees,
        rotateZ: degrees,
        scale: scale,
        scaleX: scale,
        scaleY: scale,
        scaleZ: scale,
        skew: degrees,
        skewX: degrees,
        skewY: degrees,
        distance: px,
        translateX: px,
        translateY: px,
        translateZ: px,
        x: px,
        y: px,
        z: px,
        perspective: px,
        transformPerspective: px,
        opacity: alpha,
        originX: progressPercentage,
        originY: progressPercentage,
        originZ: px,
        // Misc
        zIndex: int,
        // SVG
        fillOpacity: alpha,
        strokeOpacity: alpha,
        numOctaves: int,
    };

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    /**
     * A map of default value types for common values
     */
    var defaultValueTypes = __assign(__assign({}, numberValueTypes), { 
        // Color props
        color: color, backgroundColor: color, outlineColor: color, fill: color, stroke: color, 
        // Border props
        borderColor: color, borderTopColor: color, borderRightColor: color, borderBottomColor: color, borderLeftColor: color, filter: filter, WebkitFilter: filter });
    /**
     * Gets the default ValueType for the provided value key
     */
    var getDefaultValueType = function (key) { return defaultValueTypes[key]; };

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    function getAnimatableNone(key, value) {
        var _a;
        var defaultValueType = getDefaultValueType(key);
        if (defaultValueType !== filter)
            defaultValueType = complex;
        // If value is not recognised as animatable, ie "none", create an animatable version origin based on the target
        return (_a = defaultValueType.getAnimatableNone) === null || _a === void 0 ? void 0 : _a.call(defaultValueType, value);
    }

    /** 
    based on framer-motion@4.1.15,
    Copyright (c) 2018 Framer B.V.
    */

    /**
     * Decide whether a transition is defined on a given Transition.
     * This filters out orchestration options and returns true
     * if any options are left.
     */
    function isTransitionDefined(_a) {
        _a.when; _a.delay; _a.delayChildren; _a.staggerChildren; _a.staggerDirection; _a.repeat; _a.repeatType; _a.repeatDelay; _a.from; var transition = __rest(_a, ["when", "delay", "delayChildren", "staggerChildren", "staggerDirection", "repeat", "repeatType", "repeatDelay", "from"]);
        return !!Object.keys(transition).length;
    }
    var legacyRepeatWarning = false;
    /**
     * Convert Framer Motion's Transition type into Popmotion-compatible options.
     */
    function convertTransitionToAnimationOptions(_a) {
        var ease = _a.ease, times = _a.times, yoyo = _a.yoyo, flip = _a.flip, loop = _a.loop, transition = __rest(_a, ["ease", "times", "yoyo", "flip", "loop"]);
        var options = __assign({}, transition);
        if (times)
            options["offset"] = times;
        /**
         * Convert any existing durations from seconds to milliseconds
         */
        if (transition.duration)
            options["duration"] = secondsToMilliseconds(transition.duration);
        if (transition.repeatDelay)
            options.repeatDelay = secondsToMilliseconds(transition.repeatDelay);
        /**
         * Map easing names to Popmotion's easing functions
         */
        if (ease) {
            options["ease"] = isEasingArray(ease)
                ? ease.map(easingDefinitionToFunction)
                : easingDefinitionToFunction(ease);
        }
        /**
         * Support legacy transition API
         */
        if (transition.type === "tween")
            options.type = "keyframes";
        /**
         * TODO: These options are officially removed from the API.
         */
        if (yoyo || loop || flip) {
            warning(!legacyRepeatWarning, "yoyo, loop and flip have been removed from the API. Replace with repeat and repeatType options.");
            legacyRepeatWarning = true;
            if (yoyo) {
                options.repeatType = "reverse";
            }
            else if (loop) {
                options.repeatType = "loop";
            }
            else if (flip) {
                options.repeatType = "mirror";
            }
            options.repeat = loop || yoyo || flip || transition.repeat;
        }
        /**
         * TODO: Popmotion 9 has the ability to automatically detect whether to use
         * a keyframes or spring animation, but does so by detecting velocity and other spring options.
         * It'd be good to introduce a similar thing here.
         */
        if (transition.type !== "spring")
            options.type = "keyframes";
        return options;
    }
    /**
     * Get the delay for a value by checking Transition with decreasing specificity.
     */
    function getDelayFromTransition(transition, key) {
        var _a;
        var valueTransition = getValueTransition(transition, key) || {};
        return (_a = valueTransition.delay) !== null && _a !== void 0 ? _a : 0;
    }
    function hydrateKeyframes(options) {
        if (Array.isArray(options.to) && options.to[0] === null) {
            options.to = __spreadArray([], __read(options.to));
            options.to[0] = options.from;
        }
        return options;
    }
    function getPopmotionAnimationOptions(transition, options, key) {
        var _a;
        if (Array.isArray(options.to)) {
            (_a = transition.duration) !== null && _a !== void 0 ? _a : (transition.duration = 0.8);
        }
        hydrateKeyframes(options);
        /**
         * Get a default transition if none is determined to be defined.
         */
        if (!isTransitionDefined(transition)) {
            transition = __assign(__assign({}, transition), getDefaultTransition(key, options.to));
        }
        return __assign(__assign({}, options), convertTransitionToAnimationOptions(transition));
    }
    /**
     *
     */
    function getAnimation(key, value, target, transition, onComplete) {
        var _a;
        var valueTransition = getValueTransition(transition, key);
        var origin = (_a = valueTransition.from) !== null && _a !== void 0 ? _a : value.get();
        var isTargetAnimatable = isAnimatable(key, target);
        if (origin === "none" && isTargetAnimatable && typeof target === "string") {
            /**
             * If we're trying to animate from "none", try and get an animatable version
             * of the target. This could be improved to work both ways.
             */
            origin = getAnimatableNone(key, target);
        }
        else if (isZero(origin) && typeof target === "string") {
            origin = getZeroUnit(target);
        }
        else if (!Array.isArray(target) &&
            isZero(target) &&
            typeof origin === "string") {
            target = getZeroUnit(origin);
        }
        var isOriginAnimatable = isAnimatable(key, origin);
        warning(isOriginAnimatable === isTargetAnimatable, "You are trying to animate " + key + " from \"" + origin + "\" to \"" + target + "\". " + origin + " is not an animatable value - to enable this animation set " + origin + " to a value animatable to " + target + " via the `style` property.");
        function start() {
            var options = {
                from: origin,
                to: target,
                velocity: value.getVelocity(),
                onComplete: onComplete,
                onUpdate: function (v) { return value.set(v); },
            };
            return valueTransition.type === "inertia" ||
                valueTransition.type === "decay"
                ? inertia(__assign(__assign({}, options), valueTransition))
                : animate(__assign(__assign({}, getPopmotionAnimationOptions(valueTransition, options, key)), { onUpdate: function (v) {
                        var _a;
                        options.onUpdate(v);
                        (_a = valueTransition.onUpdate) === null || _a === void 0 ? void 0 : _a.call(valueTransition, v);
                    }, onComplete: function () {
                        var _a;
                        options.onComplete();
                        (_a = valueTransition.onComplete) === null || _a === void 0 ? void 0 : _a.call(valueTransition);
                    } }));
        }
        function set() {
            var _a;
            value.set(target);
            onComplete();
            (_a = valueTransition === null || valueTransition === void 0 ? void 0 : valueTransition.onComplete) === null || _a === void 0 ? void 0 : _a.call(valueTransition);
            return { stop: function () { } };
        }
        return !isOriginAnimatable ||
            !isTargetAnimatable ||
            valueTransition.type === false
            ? set
            : start;
    }
    function isZero(value) {
        return (value === 0 ||
            (typeof value === "string" &&
                parseFloat(value) === 0 &&
                value.indexOf(" ") === -1));
    }
    function getZeroUnit(potentialUnitType) {
        return typeof potentialUnitType === "number"
            ? 0
            : getAnimatableNone("", potentialUnitType);
    }
    function getValueTransition(transition, key) {
        return transition[key] || transition["default"] || transition;
    }
    /**
     * Start animation on a MotionValue. This function is an interface between
     * Framer Motion and Popmotion
     *
     * @internal
     */
    function startAnimation(key, value, target, transition) {
        if (transition === void 0) { transition = {}; }
        return value.start(function (onComplete) {
            var delayTimer;
            var controls;
            var animation = getAnimation(key, value, target, transition, onComplete);
            var delay = getDelayFromTransition(transition, key);
            var start = function () { return (controls = animation()); };
            if (delay) {
                delayTimer = setTimeout(start, secondsToMilliseconds(delay));
            }
            else {
                start();
            }
            return function () {
                clearTimeout(delayTimer);
                controls === null || controls === void 0 ? void 0 : controls.stop();
            };
        });
    }

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */
    /**
     * Check if value is a numerical string, ie a string that is purely a number eg "100" or "-100.1"
     */
    var isNumericalString = function (v) { return /^\-?\d*\.?\d+$/.test(v); };

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    var isCustomValue = function (v) {
        return Boolean(v && typeof v === "object" && v.mix && v.toValue);
    };
    var resolveFinalValueInKeyframes = function (v) {
        // TODO maybe throw if v.length - 1 is placeholder token?
        return isKeyframesTarget(v) ? v[v.length - 1] || 0 : v;
    };

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */
    /**
     * Tests a provided value against a ValueType
     */
    var testValueType = function (v) { return function (type) { return type.test(v); }; };

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    /**
     * ValueType for "auto"
     */
    var auto = {
        test: function (v) { return v === "auto"; },
        parse: function (v) { return v; },
    };

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    /**
     * A list of value types commonly used for dimensions
     */
    var dimensionValueTypes = [number, px, percent, degrees, vw, vh, auto];
    /**
     * Tests a dimensional value against the list of dimension ValueTypes
     */
    var findDimensionValueType = function (v) {
        return dimensionValueTypes.find(testValueType(v));
    };

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    /**
     * A list of all ValueTypes
     */
    var valueTypes = __spreadArray(__spreadArray([], __read(dimensionValueTypes)), [color, complex]);
    /**
     * Tests a value against the list of ValueTypes
     */
    var findValueType = function (v) { return valueTypes.find(testValueType(v)); };

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */
    /**
     * Decides if the supplied variable is an array of variant labels
     */
    function isVariantLabels(v) {
        return Array.isArray(v);
    }
    /**
     * Decides if the supplied variable is variant label
     */
    function isVariantLabel(v) {
        return typeof v === "string" || isVariantLabels(v);
    }
    /**
     * Creates an object containing the latest state of every MotionValue on a VisualElement
     */
    function getCurrent(visualElement) {
        var current = {};
        visualElement.forEachValue(function (value, key) { return (current[key] = value.get()); });
        return current;
    }
    /**
     * Creates an object containing the latest velocity of every MotionValue on a VisualElement
     */
    function getVelocity$1(visualElement) {
        var velocity = {};
        visualElement.forEachValue(function (value, key) { return (velocity[key] = value.getVelocity()); });
        return velocity;
    }
    function resolveVariantFromProps(props, definition, custom, currentValues, currentVelocity) {
        var _a;
        if (currentValues === void 0) { currentValues = {}; }
        if (currentVelocity === void 0) { currentVelocity = {}; }
        if (typeof definition === "string") {
            definition = (_a = props.variants) === null || _a === void 0 ? void 0 : _a[definition];
        }
        return typeof definition === "function"
            ? definition(custom !== null && custom !== void 0 ? custom : props.custom, currentValues, currentVelocity)
            : definition;
    }
    function resolveVariant(visualElement, definition, custom) {
        var props = visualElement.getProps();
        return resolveVariantFromProps(props, definition, custom !== null && custom !== void 0 ? custom : props.custom, getCurrent(visualElement), getVelocity$1(visualElement));
    }
    function checkIfControllingVariants(props) {
        var _a;
        return (typeof ((_a = props.animate) === null || _a === void 0 ? void 0 : _a.start) === "function" ||
            isVariantLabel(props.initial) ||
            isVariantLabel(props.animate) ||
            isVariantLabel(props.whileHover) ||
            isVariantLabel(props.whileDrag) ||
            isVariantLabel(props.whileTap) ||
            isVariantLabel(props.whileFocus) ||
            isVariantLabel(props.exit));
    }
    function checkIfVariantNode(props) {
        return Boolean(checkIfControllingVariants(props) || props.variants);
    }

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    /**
     * Set VisualElement's MotionValue, creating a new MotionValue for it if
     * it doesn't exist.
     */
    function setMotionValue(visualElement, key, value) {
        if (visualElement.hasValue(key)) {
            visualElement.getValue(key).set(value);
        }
        else {
            visualElement.addValue(key, motionValue(value));
        }
    }
    function setTarget(visualElement, definition) {
        var resolved = resolveVariant(visualElement, definition);
        var _a = resolved
            ? visualElement.makeTargetAnimatable(resolved, false)
            : {}, _b = _a.transitionEnd, transitionEnd = _b === void 0 ? {} : _b; _a.transition; var target = __rest(_a, ["transitionEnd", "transition"]);
        target = __assign(__assign({}, target), transitionEnd);
        for (var key in target) {
            var value = resolveFinalValueInKeyframes(target[key]);
            setMotionValue(visualElement, key, value);
        }
    }
    function checkTargetForNewValues(visualElement, target, origin) {
        var _a, _b, _c;
        var _d;
        var newValueKeys = Object.keys(target).filter(function (key) { return !visualElement.hasValue(key); });
        var numNewValues = newValueKeys.length;
        if (!numNewValues)
            return;
        for (var i = 0; i < numNewValues; i++) {
            var key = newValueKeys[i];
            var targetValue = target[key];
            var value = null;
            /**
             * If the target is a series of keyframes, we can use the first value
             * in the array. If this first value is null, we'll still need to read from the DOM.
             */
            if (Array.isArray(targetValue)) {
                value = targetValue[0];
            }
            /**
             * If the target isn't keyframes, or the first keyframe was null, we need to
             * first check if an origin value was explicitly defined in the transition as "from",
             * if not read the value from the DOM. As an absolute fallback, take the defined target value.
             */
            if (value === null) {
                value = (_b = (_a = origin[key]) !== null && _a !== void 0 ? _a : visualElement.readValue(key)) !== null && _b !== void 0 ? _b : target[key];
            }
            /**
             * If value is still undefined or null, ignore it. Preferably this would throw,
             * but this was causing issues in Framer.
             */
            if (value === undefined || value === null)
                continue;
            if (typeof value === "string" && isNumericalString(value)) {
                // If this is a number read as a string, ie "0" or "200", convert it to a number
                value = parseFloat(value);
            }
            else if (!findValueType(value) && complex.test(targetValue)) {
                value = getAnimatableNone(key, targetValue);
            }
            visualElement.addValue(key, motionValue(value));
            (_c = (_d = origin)[key]) !== null && _c !== void 0 ? _c : (_d[key] = value);
            visualElement.setBaseTarget(key, value);
        }
    }
    function getOriginFromTransition(key, transition) {
        if (!transition)
            return;
        var valueTransition = transition[key] || transition["default"] || transition;
        return valueTransition.from;
    }
    function getOrigin(target, transition, visualElement) {
        var _a, _b;
        var origin = {};
        for (var key in target) {
            origin[key] =
                (_a = getOriginFromTransition(key, transition)) !== null && _a !== void 0 ? _a : (_b = visualElement.getValue(key)) === null || _b === void 0 ? void 0 : _b.get();
        }
        return origin;
    }

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    /**
     * @internal
     */
    function animateVisualElement(visualElement, definition, options) {
        if (options === void 0) { options = {}; }
        visualElement.notifyAnimationStart();
        var animation;
        if (Array.isArray(definition)) {
            var animations = definition.map(function (variant) {
                return animateVariant(visualElement, variant, options);
            });
            animation = Promise.all(animations);
        }
        else if (typeof definition === "string") {
            animation = animateVariant(visualElement, definition, options);
        }
        else {
            var resolvedDefinition = typeof definition === "function"
                ? resolveVariant(visualElement, definition, options.custom)
                : definition;
            animation = animateTarget(visualElement, resolvedDefinition, options);
        }
        return animation.then(function () {
            return visualElement.notifyAnimationComplete(definition);
        });
    }
    function animateVariant(visualElement, variant, options) {
        var _a;
        if (options === void 0) { options = {}; }
        var resolved = resolveVariant(visualElement, variant, options.custom);
        var _b = (resolved || {}).transition, transition = _b === void 0 ? visualElement.getDefaultTransition() || {} : _b;
        if (options.transitionOverride) {
            transition = options.transitionOverride;
        }
        /**
         * If we have a variant, create a callback that runs it as an animation.
         * Otherwise, we resolve a Promise immediately for a composable no-op.
         */
        var getAnimation = resolved
            ? function () { return animateTarget(visualElement, resolved, options); }
            : function () { return Promise.resolve(); };
        /**
         * If we have children, create a callback that runs all their animations.
         * Otherwise, we resolve a Promise immediately for a composable no-op.
         */
        var getChildAnimations = ((_a = visualElement.variantChildren) === null || _a === void 0 ? void 0 : _a.size)
            ? function (forwardDelay) {
                if (forwardDelay === void 0) { forwardDelay = 0; }
                var _a = transition.delayChildren, delayChildren = _a === void 0 ? 0 : _a, staggerChildren = transition.staggerChildren, staggerDirection = transition.staggerDirection;
                return animateChildren(visualElement, variant, delayChildren + forwardDelay, staggerChildren, staggerDirection, options);
            }
            : function () { return Promise.resolve(); };
        /**
         * If the transition explicitly defines a "when" option, we need to resolve either
         * this animation or all children animations before playing the other.
         */
        var when = transition.when;
        if (when) {
            var _c = __read(when === "beforeChildren"
                ? [getAnimation, getChildAnimations]
                : [getChildAnimations, getAnimation], 2), first = _c[0], last = _c[1];
            return first().then(last);
        }
        else {
            return Promise.all([getAnimation(), getChildAnimations(options.delay)]);
        }
    }
    /**
     * @internal
     */
    function animateTarget(visualElement, definition, _a) {
        var _b;
        var _c = _a === void 0 ? {} : _a, _d = _c.delay, delay = _d === void 0 ? 0 : _d, transitionOverride = _c.transitionOverride, type = _c.type;
        var _e = visualElement.makeTargetAnimatable(definition), _f = _e.transition, transition = _f === void 0 ? visualElement.getDefaultTransition() : _f, transitionEnd = _e.transitionEnd, target = __rest(_e, ["transition", "transitionEnd"]);
        if (transitionOverride)
            transition = transitionOverride;
        var animations = [];
        var animationTypeState = type && ((_b = visualElement.animationState) === null || _b === void 0 ? void 0 : _b.getState()[type]);
        for (var key in target) {
            var value = visualElement.getValue(key);
            var valueTarget = target[key];
            if (!value ||
                valueTarget === undefined ||
                (animationTypeState &&
                    shouldBlockAnimation(animationTypeState, key))) {
                continue;
            }
            var animation = startAnimation(key, value, valueTarget, __assign({ delay: delay }, transition));
            animations.push(animation);
        }
        return Promise.all(animations).then(function () {
            transitionEnd && setTarget(visualElement, transitionEnd);
        });
    }
    function animateChildren(visualElement, variant, delayChildren, staggerChildren, staggerDirection, options) {
        if (delayChildren === void 0) { delayChildren = 0; }
        if (staggerChildren === void 0) { staggerChildren = 0; }
        if (staggerDirection === void 0) { staggerDirection = 1; }
        var animations = [];
        var maxStaggerDuration = (visualElement.variantChildren.size - 1) * staggerChildren;
        var generateStaggerDuration = staggerDirection === 1
            ? function (i) {
                if (i === void 0) { i = 0; }
                return i * staggerChildren;
            }
            : function (i) {
                if (i === void 0) { i = 0; }
                return maxStaggerDuration - i * staggerChildren;
            };
        Array.from(visualElement.variantChildren)
            .sort(sortByTreeOrder)
            .forEach(function (child, i) {
            animations.push(animateVariant(child, variant, __assign(__assign({}, options), { delay: delayChildren + generateStaggerDuration(i) })).then(function () { return child.notifyAnimationComplete(variant); }));
        });
        return Promise.all(animations);
    }
    function sortByTreeOrder(a, b) {
        return a.sortNodePosition(b);
    }
    /**
     * Decide whether we should block this animation. Previously, we achieved this
     * just by checking whether the key was listed in protectedKeys, but this
     * posed problems if an animation was triggered by afterChildren and protectedKeys
     * had been set to true in the meantime.
     */
    function shouldBlockAnimation(_a, key) {
        
        var protectedKeys = _a.protectedKeys, needsAnimating = _a.needsAnimating;
        var shouldBlock = protectedKeys.hasOwnProperty(key) && needsAnimating[key] !== true;
        needsAnimating[key] = false;
        return shouldBlock;
    }

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */
    var valueScaleCorrection = {};
    /**
     * @internal
     */
    function addScaleCorrection(correctors) {
        for (var key in correctors) {
            valueScaleCorrection[key] = correctors[key];
        }
    }

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */
    // Call a handler once for each axis
    function eachAxis(handler) {
        return [handler("x"), handler("y")];
    }

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */
    function noop(any) {
        return any;
    }

    /** 
    based on framer-motion@4.1.15,
    Copyright (c) 2018 Framer B.V.
    */

    /**
     * Bounding boxes tend to be defined as top, left, right, bottom. For various operations
     * it's easier to consider each axis individually. This function returns a bounding box
     * as a map of single-axis min/max values.
     */
    function convertBoundingBoxToAxisBox(_a) {
        var top = _a.top, left = _a.left, right = _a.right, bottom = _a.bottom;
        return {
            x: { min: left, max: right },
            y: { min: top, max: bottom },
        };
    }
    function convertAxisBoxToBoundingBox(_a) {
        var x = _a.x, y = _a.y;
        return {
            top: y.min,
            bottom: y.max,
            left: x.min,
            right: x.max,
        };
    }
    /**
     * Applies a TransformPoint function to a bounding box. TransformPoint is usually a function
     * provided by Framer to allow measured points to be corrected for device scaling. This is used
     * when measuring DOM elements and DOM event points.
     */
    function transformBoundingBox(_a, transformPoint) {
        var top = _a.top, left = _a.left, bottom = _a.bottom, right = _a.right;
        if (transformPoint === void 0) { transformPoint = noop; }
        var topLeft = transformPoint({ x: left, y: top });
        var bottomRight = transformPoint({ x: right, y: bottom });
        return {
            top: topLeft.y,
            left: topLeft.x,
            bottom: bottomRight.y,
            right: bottomRight.x,
        };
    }
    /**
     * Create an empty axis box of zero size
     */
    function axisBox() {
        return { x: { min: 0, max: 1 }, y: { min: 0, max: 1 } };
    }
    function copyAxisBox(box) {
        return {
            x: __assign({}, box.x),
            y: __assign({}, box.y),
        };
    }
    /**
     * Create an empty box delta
     */
    var zeroDelta = {
        translate: 0,
        scale: 1,
        origin: 0,
        originPoint: 0,
    };
    function delta() {
        return {
            x: __assign({}, zeroDelta),
            y: __assign({}, zeroDelta),
        };
    }

    /** 
    based on framer-motion@4.1.11,
    Copyright (c) 2018 Framer B.V.
    */
    function isDraggable(visualElement) {
        var _a = visualElement.getProps(), drag = _a.drag, _dragX = _a._dragX;
        return drag && !_dragX;
    }

    /** 
    based on framer-motion@4.1.15,
    Copyright (c) 2018 Framer B.V.
    */

    /**
     * Reset an axis to the provided origin box.
     *
     * This is a mutative operation.
     */
    function resetAxis(axis, originAxis) {
        axis.min = originAxis.min;
        axis.max = originAxis.max;
    }
    /**
     * Reset a box to the provided origin box.
     *
     * This is a mutative operation.
     */
    function resetBox(box, originBox) {
        resetAxis(box.x, originBox.x);
        resetAxis(box.y, originBox.y);
    }
    /**
     * Scales a point based on a factor and an originPoint
     */
    function scalePoint(point, scale, originPoint) {
        var distanceFromOrigin = point - originPoint;
        var scaled = scale * distanceFromOrigin;
        return originPoint + scaled;
    }
    /**
     * Applies a translate/scale delta to a point
     */
    function applyPointDelta(point, translate, scale, originPoint, boxScale) {
        if (boxScale !== undefined) {
            point = scalePoint(point, boxScale, originPoint);
        }
        return scalePoint(point, scale, originPoint) + translate;
    }
    /**
     * Applies a translate/scale delta to an axis
     */
    function applyAxisDelta(axis, translate, scale, originPoint, boxScale) {
        if (translate === void 0) { translate = 0; }
        if (scale === void 0) { scale = 1; }
        axis.min = applyPointDelta(axis.min, translate, scale, originPoint, boxScale);
        axis.max = applyPointDelta(axis.max, translate, scale, originPoint, boxScale);
    }
    /**
     * Applies a translate/scale delta to a box
     */
    function applyBoxDelta(box, _a) {
        var x = _a.x, y = _a.y;
        applyAxisDelta(box.x, x.translate, x.scale, x.originPoint);
        applyAxisDelta(box.y, y.translate, y.scale, y.originPoint);
    }
    /**
     * Apply a transform to an axis from the latest resolved motion values.
     * This function basically acts as a bridge between a flat motion value map
     * and applyAxisDelta
     */
    function applyAxisTransforms(final, axis, transforms, _a) {
        var _b = __read(_a, 3), key = _b[0], scaleKey = _b[1], originKey = _b[2];
        // Copy the current axis to the final axis before mutation
        final.min = axis.min;
        final.max = axis.max;
        var axisOrigin = transforms[originKey] !== undefined ? transforms[originKey] : 0.5;
        var originPoint = mix(axis.min, axis.max, axisOrigin);
        // Apply the axis delta to the final axis
        applyAxisDelta(final, transforms[key], transforms[scaleKey], originPoint, transforms.scale);
    }
    /**
     * The names of the motion values we want to apply as translation, scale and origin.
     */
    var xKeys = ["x", "scaleX", "originX"];
    var yKeys = ["y", "scaleY", "originY"];
    /**
     * Apply a transform to a box from the latest resolved motion values.
     */
    function applyBoxTransforms(finalBox, box, transforms) {
        applyAxisTransforms(finalBox.x, box.x, transforms, xKeys);
        applyAxisTransforms(finalBox.y, box.y, transforms, yKeys);
    }
    /**
     * Remove a delta from a point. This is essentially the steps of applyPointDelta in reverse
     */
    function removePointDelta(point, translate, scale, originPoint, boxScale) {
        point -= translate;
        point = scalePoint(point, 1 / scale, originPoint);
        if (boxScale !== undefined) {
            point = scalePoint(point, 1 / boxScale, originPoint);
        }
        return point;
    }
    /**
     * Remove a delta from an axis. This is essentially the steps of applyAxisDelta in reverse
     */
    function removeAxisDelta(axis, translate, scale, origin, boxScale) {
        if (translate === void 0) { translate = 0; }
        if (scale === void 0) { scale = 1; }
        if (origin === void 0) { origin = 0.5; }
        var originPoint = mix(axis.min, axis.max, origin) - translate;
        axis.min = removePointDelta(axis.min, translate, scale, originPoint, boxScale);
        axis.max = removePointDelta(axis.max, translate, scale, originPoint, boxScale);
    }
    /**
     * Remove a transforms from an axis. This is essentially the steps of applyAxisTransforms in reverse
     * and acts as a bridge between motion values and removeAxisDelta
     */
    function removeAxisTransforms(axis, transforms, _a) {
        var _b = __read(_a, 3), key = _b[0], scaleKey = _b[1], originKey = _b[2];
        removeAxisDelta(axis, transforms[key], transforms[scaleKey], transforms[originKey], transforms.scale);
    }
    /**
     * Remove a transforms from an box. This is essentially the steps of applyAxisBox in reverse
     * and acts as a bridge between motion values and removeAxisDelta
     */
    function removeBoxTransforms(box, transforms) {
        removeAxisTransforms(box.x, transforms, xKeys);
        removeAxisTransforms(box.y, transforms, yKeys);
    }
    /**
     * Apply a tree of deltas to a box. We do this to calculate the effect of all the transforms
     * in a tree upon our box before then calculating how to project it into our desired viewport-relative box
     *
     * This is the final nested loop within updateLayoutDelta for future refactoring
     */
    function applyTreeDeltas(box, treeScale, treePath) {
        var treeLength = treePath.length;
        if (!treeLength)
            return;
        // Reset the treeScale
        treeScale.x = treeScale.y = 1;
        var node;
        var delta;
        for (var i = 0; i < treeLength; i++) {
            node = treePath[i];
            delta = node.getLayoutState().delta;
            // Incoporate each ancestor's scale into a culmulative treeScale for this component
            treeScale.x *= delta.x.scale;
            treeScale.y *= delta.y.scale;
            // Apply each ancestor's calculated delta into this component's recorded layout box
            applyBoxDelta(box, delta);
            // If this is a draggable ancestor, also incorporate the node's transform to the layout box
            if (isDraggable(node)) {
                applyBoxTransforms(box, box, node.getLatestValues());
            }
        }
    }

    /** 
    based on framer-motion@4.1.15,
    Copyright (c) 2018 Framer B.V.
    */

    var clampProgress = function (v) { return clamp$1(0, 1, v); };
    /**
     * Returns true if the provided value is within maxDistance of the provided target
     */
    function isNear(value, target, maxDistance) {
        if (target === void 0) { target = 0; }
        if (maxDistance === void 0) { maxDistance = 0.01; }
        return distance(value, target) < maxDistance;
    }
    function calcLength(axis) {
        return axis.max - axis.min;
    }
    /**
     * Calculate a transform origin relative to the source axis, between 0-1, that results
     * in an asthetically pleasing scale/transform needed to project from source to target.
     */
    function calcOrigin$1(source, target) {
        var origin = 0.5;
        var sourceLength = calcLength(source);
        var targetLength = calcLength(target);
        if (targetLength > sourceLength) {
            origin = progress(target.min, target.max - sourceLength, source.min);
        }
        else if (sourceLength > targetLength) {
            origin = progress(source.min, source.max - targetLength, target.min);
        }
        return clampProgress(origin);
    }
    /**
     * Update the AxisDelta with a transform that projects source into target.
     *
     * The transform `origin` is optional. If not provided, it'll be automatically
     * calculated based on the relative positions of the two bounding boxes.
     */
    function updateAxisDelta(delta, source, target, origin) {
        if (origin === void 0) { origin = 0.5; }
        delta.origin = origin;
        delta.originPoint = mix(source.min, source.max, delta.origin);
        delta.scale = calcLength(target) / calcLength(source);
        if (isNear(delta.scale, 1, 0.0001))
            delta.scale = 1;
        delta.translate =
            mix(target.min, target.max, delta.origin) - delta.originPoint;
        if (isNear(delta.translate))
            delta.translate = 0;
    }
    /**
     * Update the BoxDelta with a transform that projects the source into the target.
     *
     * The transform `origin` is optional. If not provided, it'll be automatically
     * calculated based on the relative positions of the two bounding boxes.
     */
    function updateBoxDelta(delta, source, target, origin) {
        updateAxisDelta(delta.x, source.x, target.x, defaultOrigin(origin.originX));
        updateAxisDelta(delta.y, source.y, target.y, defaultOrigin(origin.originY));
    }
    /**
     * Currently this only accepts numerical origins, measured as 0-1, but could
     * accept pixel values by comparing to the target axis.
     */
    function defaultOrigin(origin) {
        return typeof origin === "number" ? origin : 0.5;
    }
    function calcRelativeAxis(target, relative, parent) {
        target.min = parent.min + relative.min;
        target.max = target.min + calcLength(relative);
    }
    function calcRelativeBox(projection, parentProjection) {
        calcRelativeAxis(projection.target.x, projection.relativeTarget.x, parentProjection.target.x);
        calcRelativeAxis(projection.target.y, projection.relativeTarget.y, parentProjection.target.y);
    }

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */
    var isMotionValue = function (value) {
        return value !== null && typeof value === "object" && value.getVelocity;
    };

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    var createProjectionState = function () { return ({
        isEnabled: false,
        isTargetLocked: false,
        target: axisBox(),
        targetFinal: axisBox(),
    }); };
    function createLayoutState() {
        return {
            isHydrated: false,
            layout: axisBox(),
            layoutCorrected: axisBox(),
            treeScale: { x: 1, y: 1 },
            delta: delta(),
            deltaFinal: delta(),
            deltaTransform: "",
        };
    }
    var zeroLayout = createLayoutState();

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    /**
     * Build a transform style that takes a calculated delta between the element's current
     * space on screen and projects it into the desired space.
     */
    function buildLayoutProjectionTransform(_a, treeScale, latestTransform) {
        var x = _a.x, y = _a.y;
        /**
         * The translations we use to calculate are always relative to the viewport coordinate space.
         * But when we apply scales, we also scale the coordinate space of an element and its children.
         * For instance if we have a treeScale (the culmination of all parent scales) of 0.5 and we need
         * to move an element 100 pixels, we actually need to move it 200 in within that scaled space.
         */
        var xTranslate = x.translate / treeScale.x;
        var yTranslate = y.translate / treeScale.y;
        var transform = "translate3d(" + xTranslate + "px, " + yTranslate + "px, 0) ";
        if (latestTransform) {
            var rotate = latestTransform.rotate, rotateX = latestTransform.rotateX, rotateY = latestTransform.rotateY;
            if (rotate)
                transform += "rotate(" + rotate + ") ";
            if (rotateX)
                transform += "rotateX(" + rotateX + ") ";
            if (rotateY)
                transform += "rotateY(" + rotateY + ") ";
        }
        transform += "scale(" + x.scale + ", " + y.scale + ")";
        return !latestTransform && transform === identityProjection ? "" : transform;
    }
    /**
     * Take the calculated delta origin and apply it as a transform string.
     */
    function buildLayoutProjectionTransformOrigin(_a) {
        var deltaFinal = _a.deltaFinal;
        return deltaFinal.x.origin * 100 + "% " + deltaFinal.y.origin * 100 + "% 0";
    }
    var identityProjection = buildLayoutProjectionTransform(zeroLayout.delta, zeroLayout.treeScale, { x: 1, y: 1 });

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    var isAnimationControls = function (v) {
        return typeof v === "object" && typeof (v).start === "function"
    };

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */
    function shallowCompare(next, prev) {
        if (!Array.isArray(prev))
            return false;
        var prevLength = prev.length;
        if (prevLength !== next.length)
            return false;
        for (var i = 0; i < prevLength; i++) {
            if (prev[i] !== next[i])
                return false;
        }
        return true;
    }

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */
    var AnimationType;
    (function (AnimationType) {
        AnimationType["Animate"] = "animate";
        AnimationType["Hover"] = "whileHover";
        AnimationType["Tap"] = "whileTap";
        AnimationType["Drag"] = "whileDrag";
        AnimationType["Focus"] = "whileFocus";
        AnimationType["Exit"] = "exit";
    })(AnimationType || (AnimationType = {}));

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    var variantPriorityOrder = [
        AnimationType.Animate,
        AnimationType.Hover,
        AnimationType.Tap,
        AnimationType.Drag,
        AnimationType.Focus,
        AnimationType.Exit,
    ];
    var reversePriorityOrder = __spreadArray([], __read(variantPriorityOrder)).reverse();
    var numAnimationTypes = variantPriorityOrder.length;
    function animateList(visualElement) {
        return function (animations) {
            return Promise.all(animations.map(function (_a) {
                var animation = _a.animation, options = _a.options;
                return animateVisualElement(visualElement, animation, options);
            }));
        };
    }
    function createAnimationState(visualElement) {
        var animate = animateList(visualElement);
        var state = createState();
        var allAnimatedKeys = {};
        var isInitialRender = true;
        /**
         * This function will be used to reduce the animation definitions for
         * each active animation type into an object of resolved values for it.
         */
        var buildResolvedTypeValues = function (acc, definition) {
            var resolved = resolveVariant(visualElement, definition);
            if (resolved) {
                resolved.transition; var transitionEnd = resolved.transitionEnd, target = __rest(resolved, ["transition", "transitionEnd"]);
                acc = __assign(__assign(__assign({}, acc), target), transitionEnd);
            }
            return acc;
        };
        function isAnimated(key) {
            return allAnimatedKeys[key] !== undefined;
        }
        /**
         * This just allows us to inject mocked animation functions
         * @internal
         */
        function setAnimateFunction(makeAnimator) {
            animate = makeAnimator(visualElement);
        }
        /**
         * When we receive new props, we need to:
         * 1. Create a list of protected keys for each type. This is a directory of
         *    value keys that are currently being "handled" by types of a higher priority
         *    so that whenever an animation is played of a given type, these values are
         *    protected from being animated.
         * 2. Determine if an animation type needs animating.
         * 3. Determine if any values have been removed from a type and figure out
         *    what to animate those to.
         */
        function animateChanges(options, changedActiveType) {
            var _a;
            var props = visualElement.getProps();
            var context = visualElement.getVariantContext(true) || {};
            /**
             * A list of animations that we'll build into as we iterate through the animation
             * types. This will get executed at the end of the function.
             */
            var animations = [];
            /**
             * Keep track of which values have been removed. Then, as we hit lower priority
             * animation types, we can check if they contain removed values and animate to that.
             */
            var removedKeys = new Set();
            /**
             * A dictionary of all encountered keys. This is an object to let us build into and
             * copy it without iteration. Each time we hit an animation type we set its protected
             * keys - the keys its not allowed to animate - to the latest version of this object.
             */
            var encounteredKeys = {};
            /**
             * If a variant has been removed at a given index, and this component is controlling
             * variant animations, we want to ensure lower-priority variants are forced to animate.
             */
            var removedVariantIndex = Infinity;
            var _loop_1 = function (i) {
                var type = reversePriorityOrder[i];
                var typeState = state[type];
                var prop = (_a = props[type]) !== null && _a !== void 0 ? _a : context[type];
                var propIsVariant = isVariantLabel(prop);
                /**
                 * If this type has *just* changed isActive status, set activeDelta
                 * to that status. Otherwise set to null.
                 */
                var activeDelta = type === changedActiveType ? typeState.isActive : null;
                if (activeDelta === false)
                    removedVariantIndex = i;
                /**
                 * If this prop is an inherited variant, rather than been set directly on the
                 * component itself, we want to make sure we allow the parent to trigger animations.
                 *
                 * TODO: Can probably change this to a !isControllingVariants check
                 */
                var isInherited = prop === context[type] && prop !== props[type] && propIsVariant;
                /**
                 *
                 */
                if (isInherited &&
                    isInitialRender &&
                    visualElement.manuallyAnimateOnMount) {
                    isInherited = false;
                }
                /**
                 * Set all encountered keys so far as the protected keys for this type. This will
                 * be any key that has been animated or otherwise handled by active, higher-priortiy types.
                 */
                typeState.protectedKeys = __assign({}, encounteredKeys);
                // Check if we can skip analysing this prop early
                if (
                // If it isn't active and hasn't *just* been set as inactive
                (!typeState.isActive && activeDelta === null) ||
                    // If we didn't and don't have any defined prop for this animation type
                    (!prop && !typeState.prevProp) ||
                    // Or if the prop doesn't define an animation
                    isAnimationControls(prop) ||
                    typeof prop === "boolean") {
                    return "continue";
                }
                /**
                 * As we go look through the values defined on this type, if we detect
                 * a changed value or a value that was removed in a higher priority, we set
                 * this to true and add this prop to the animation list.
                 */
                var shouldAnimateType = variantsHaveChanged(typeState.prevProp, prop) ||
                    // If we're making this variant active, we want to always make it active
                    (type === changedActiveType &&
                        typeState.isActive &&
                        !isInherited &&
                        propIsVariant) ||
                    // If we removed a higher-priority variant (i is in reverse order)
                    (i > removedVariantIndex && propIsVariant);
                /**
                 * As animations can be set as variant lists, variants or target objects, we
                 * coerce everything to an array if it isn't one already
                 */
                var definitionList = Array.isArray(prop) ? prop : [prop];
                /**
                 * Build an object of all the resolved values. We'll use this in the subsequent
                 * animateChanges calls to determine whether a value has changed.
                 */
                var resolvedValues = definitionList.reduce(buildResolvedTypeValues, {});
                if (activeDelta === false)
                    resolvedValues = {};
                /**
                 * Now we need to loop through all the keys in the prev prop and this prop,
                 * and decide:
                 * 1. If the value has changed, and needs animating
                 * 2. If it has been removed, and needs adding to the removedKeys set
                 * 3. If it has been removed in a higher priority type and needs animating
                 * 4. If it hasn't been removed in a higher priority but hasn't changed, and
                 *    needs adding to the type's protectedKeys list.
                 */
                var _b = typeState.prevResolvedValues, prevResolvedValues = _b === void 0 ? {} : _b;
                var allKeys = __assign(__assign({}, prevResolvedValues), resolvedValues);
                var markToAnimate = function (key) {
                    shouldAnimateType = true;
                    removedKeys.delete(key);
                    typeState.needsAnimating[key] = true;
                };
                for (var key in allKeys) {
                    var next = resolvedValues[key];
                    var prev = prevResolvedValues[key];
                    // If we've already handled this we can just skip ahead
                    if (encounteredKeys.hasOwnProperty(key))
                        continue;
                    /**
                     * If the value has changed, we probably want to animate it.
                     */
                    if (next !== prev) {
                        /**
                         * If both values are keyframes, we need to shallow compare them to
                         * detect whether any value has changed. If it has, we animate it.
                         */
                        if (isKeyframesTarget(next) && isKeyframesTarget(prev)) {
                            if (!shallowCompare(next, prev)) {
                                markToAnimate(key);
                            }
                            else {
                                /**
                                 * If it hasn't changed, we want to ensure it doesn't animate by
                                 * adding it to the list of protected keys.
                                 */
                                typeState.protectedKeys[key] = true;
                            }
                        }
                        else if (next !== undefined) {
                            // If next is defined and doesn't equal prev, it needs animating
                            markToAnimate(key);
                        }
                        else {
                            // If it's undefined, it's been removed.
                            removedKeys.add(key);
                        }
                    }
                    else if (next !== undefined && removedKeys.has(key)) {
                        /**
                         * If next hasn't changed and it isn't undefined, we want to check if it's
                         * been removed by a higher priority
                         */
                        markToAnimate(key);
                    }
                    else {
                        /**
                         * If it hasn't changed, we add it to the list of protected values
                         * to ensure it doesn't get animated.
                         */
                        typeState.protectedKeys[key] = true;
                    }
                }
                /**
                 * Update the typeState so next time animateChanges is called we can compare the
                 * latest prop and resolvedValues to these.
                 */
                typeState.prevProp = prop;
                typeState.prevResolvedValues = resolvedValues;
                /**
                 *
                 */
                if (typeState.isActive) {
                    encounteredKeys = __assign(__assign({}, encounteredKeys), resolvedValues);
                }
                if (isInitialRender && visualElement.blockInitialAnimation) {
                    shouldAnimateType = false;
                }
                /**
                 * If this is an inherited prop we want to hard-block animations
                 * TODO: Test as this should probably still handle animations triggered
                 * by removed values?
                 */
                if (shouldAnimateType && !isInherited) {
                    animations.push.apply(animations, __spreadArray([], __read(definitionList.map(function (animation) { return ({
                        animation: animation,
                        options: __assign({ type: type }, options),
                    }); }))));
                }
            };
            /**
             * Iterate through all animation types in reverse priority order. For each, we want to
             * detect which values it's handling and whether or not they've changed (and therefore
             * need to be animated). If any values have been removed, we want to detect those in
             * lower priority props and flag for animation.
             */
            for (var i = 0; i < numAnimationTypes; i++) {
                _loop_1(i);
            }
            allAnimatedKeys = __assign({}, encounteredKeys);
            /**
             * If there are some removed value that haven't been dealt with,
             * we need to create a new animation that falls back either to the value
             * defined in the style prop, or the last read value.
             */
            if (removedKeys.size) {
                var fallbackAnimation_1 = {};
                removedKeys.forEach(function (key) {
                    var fallbackTarget = visualElement.getBaseTarget(key);
                    if (fallbackTarget !== undefined) {
                        fallbackAnimation_1[key] = fallbackTarget;
                    }
                });
                animations.push({ animation: fallbackAnimation_1 });
            }
            var shouldAnimate = Boolean(animations.length);
            if (isInitialRender &&
                props.initial === false &&
                !visualElement.manuallyAnimateOnMount) {
                shouldAnimate = false;
            }
            isInitialRender = false;
            return shouldAnimate ? animate(animations) : Promise.resolve();
        }
        /**
         * Change whether a certain animation type is active.
         */
        function setActive(type, isActive, options) {
            var _a;
            // If the active state hasn't changed, we can safely do nothing here
            if (state[type].isActive === isActive)
                return Promise.resolve();
            // Propagate active change to children
            (_a = visualElement.variantChildren) === null || _a === void 0 ? void 0 : _a.forEach(function (child) { var _a; return (_a = child.animationState) === null || _a === void 0 ? void 0 : _a.setActive(type, isActive); });
            state[type].isActive = isActive;
            return animateChanges(options, type);
        }
        return {
            isAnimated: isAnimated,
            animateChanges: animateChanges,
            setActive: setActive,
            setAnimateFunction: setAnimateFunction,
            getState: function () { return state; },
        };
    }
    function variantsHaveChanged(prev, next) {
        if (typeof next === "string") {
            return next !== prev;
        }
        else if (isVariantLabels(next)) {
            return !shallowCompare(next, prev);
        }
        return false;
    }
    function createTypeState(isActive) {
        if (isActive === void 0) { isActive = false; }
        return {
            isActive: isActive,
            protectedKeys: {},
            needsAnimating: {},
            prevResolvedValues: {},
        };
    }
    function createState() {
        var _a;
        return _a = {},
            _a[AnimationType.Animate] = createTypeState(true),
            _a[AnimationType.Hover] = createTypeState(),
            _a[AnimationType.Tap] = createTypeState(),
            _a[AnimationType.Drag] = createTypeState(),
            _a[AnimationType.Focus] = createTypeState(),
            _a[AnimationType.Exit] = createTypeState(),
            _a;
    }

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    var names = [
        "LayoutMeasure",
        "BeforeLayoutMeasure",
        "LayoutUpdate",
        "ViewportBoxUpdate",
        "Update",
        "Render",
        "AnimationComplete",
        "LayoutAnimationComplete",
        "AnimationStart",
        "SetAxisTarget",
        "Unmount",
    ];
    function createLifecycles() {
        var managers = names.map(function () { return new SubscriptionManager(); });
        var propSubscriptions = {};
        var lifecycles = {
            clearAllListeners: function () { return managers.forEach(function (manager) { return manager.clear(); }); },
            updatePropListeners: function (props) {
                return names.forEach(function (name) {
                    var _a;
                    (_a = propSubscriptions[name]) === null || _a === void 0 ? void 0 : _a.call(propSubscriptions);
                    var on = "on" + name;
                    var propListener = props[on];
                    if (propListener) {
                        propSubscriptions[name] = lifecycles[on](propListener);
                    }
                });
            },
        };
        managers.forEach(function (manager, i) {
            lifecycles["on" + names[i]] = function (handler) { return manager.add(handler); };
            lifecycles["notify" + names[i]] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return manager.notify.apply(manager, __spreadArray([], __read(args)));
            };
        });
        return lifecycles;
    }

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    function updateMotionValuesFromProps(element, next, prev) {
        var _a;
        for (var key in next) {
            var nextValue = next[key];
            var prevValue = prev[key];
            if (isMotionValue(nextValue)) {
                /**
                 * If this is a motion value found in props or style, we want to add it
                 * to our visual element's motion value map.
                 */
                element.addValue(key, nextValue);
            }
            else if (isMotionValue(prevValue)) {
                /**
                 * If we're swapping to a new motion value, create a new motion value
                 * from that
                 */
                element.addValue(key, motionValue(nextValue));
            }
            else if (prevValue !== nextValue) {
                /**
                 * If this is a flat value that has changed, update the motion value
                 * or create one if it doesn't exist. We only want to do this if we're
                 * not handling the value with our animation state.
                 */
                if (element.hasValue(key)) {
                    var existingValue = element.getValue(key);
                    // TODO: Only update values that aren't being animated or even looked at
                    !existingValue.hasAnimated && existingValue.set(nextValue);
                }
                else {
                    element.addValue(key, motionValue((_a = element.getStaticValue(key)) !== null && _a !== void 0 ? _a : nextValue));
                }
            }
        }
        // Handle removed values
        for (var key in prev) {
            if (next[key] === undefined)
                element.removeValue(key);
        }
        return next;
    }

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    function updateLayoutDeltas(_a, _b, treePath, transformOrigin) {
        var delta = _a.delta, layout = _a.layout, layoutCorrected = _a.layoutCorrected, treeScale = _a.treeScale;
        var target = _b.target;
        /**
         * Reset the corrected box with the latest values from box, as we're then going
         * to perform mutative operations on it.
         */
        resetBox(layoutCorrected, layout);
        /**
         * Apply all the parent deltas to this box to produce the corrected box. This
         * is the layout box, as it will appear on screen as a result of the transforms of its parents.
         */
        applyTreeDeltas(layoutCorrected, treeScale, treePath);
        /**
         * Update the delta between the corrected box and the target box before user-set transforms were applied.
         * This will allow us to calculate the corrected borderRadius and boxShadow to compensate
         * for our layout reprojection, but still allow them to be scaled correctly by the user.
         * It might be that to simplify this we may want to accept that user-set scale1 is also corrected
         * and we wouldn't have to keep and calc both deltas, OR we could support a user setting
         * to allow people to choose whether these styles are corrected based on just the
         * layout reprojection or the final bounding box.
         */
        updateBoxDelta(delta, layoutCorrected, target, transformOrigin);
    }

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */
    var compareByDepth = function (a, b) {
        return a.depth - b.depth;
    };

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    var FlatTree = /** @class */ (function () {
        function FlatTree() {
            this.children = [];
            this.isDirty = false;
        }
        FlatTree.prototype.add = function (child) {
            addUniqueItem(this.children, child);
            this.isDirty = true;
        };
        FlatTree.prototype.remove = function (child) {
            removeItem(this.children, child);
            this.isDirty = true;
        };
        FlatTree.prototype.forEach = function (callback) {
            this.isDirty && this.children.sort(compareByDepth);
            var numChildren = this.children.length;
            for (var i = 0; i < numChildren; i++) {
                callback(this.children[i]);
            }
        };
        return FlatTree;
    }());

    /** 
    based on framer-motion@4.1.11,
    Copyright (c) 2018 Framer B.V.
    */

    function tweenAxis(target, prev, next, p) {
        target.min = mix(prev.min, next.min, p);
        target.max = mix(prev.max, next.max, p);
    }
    function calcRelativeOffsetAxis(parent, child) {
        return {
            min: child.min - parent.min,
            max: child.max - parent.min,
        };
    }
    function calcRelativeOffset(parent, child) {
        return {
            x: calcRelativeOffsetAxis(parent.x, child.x),
            y: calcRelativeOffsetAxis(parent.y, child.y),
        };
    }

    /** 
    based on framer-motion@4.1.11,
    Copyright (c) 2018 Framer B.V.
    */

    function setCurrentViewportBox(visualElement) {
        var projectionParent = visualElement.getProjectionParent();
        if (!projectionParent) {
            visualElement.rebaseProjectionTarget();
            return;
        }
        var relativeOffset = calcRelativeOffset(projectionParent.getLayoutState().layout, visualElement.getLayoutState().layout);
        eachAxis(function (axis) {
            visualElement.setProjectionTargetAxis(axis, relativeOffset[axis].min, relativeOffset[axis].max, true);
        });
    }

    /** 
    based on framer-motion@4.1.1,
    Copyright (c) 2018 Framer B.V.
    */

    var visualElement = function (_a) {
        var _b = _a.treeType, treeType = _b === void 0 ? "" : _b, build = _a.build, getBaseTarget = _a.getBaseTarget, makeTargetAnimatable = _a.makeTargetAnimatable, measureViewportBox = _a.measureViewportBox, renderInstance = _a.render, readValueFromInstance = _a.readValueFromInstance, resetTransform = _a.resetTransform, restoreTransform = _a.restoreTransform, removeValueFromRenderState = _a.removeValueFromRenderState, sortNodePosition = _a.sortNodePosition, scrapeMotionValuesFromProps = _a.scrapeMotionValuesFromProps;
        return function (_a, options) {
            var parent = _a.parent, props = _a.props, presenceId = _a.presenceId, blockInitialAnimation = _a.blockInitialAnimation, visualState = _a.visualState;
            if (options === void 0) { options = {}; }
            var latestValues = visualState.latestValues, renderState = visualState.renderState;
            /**
             * The instance of the render-specific node that will be hydrated by the
             * exposed React ref. So for example, this visual element can host a
             * HTMLElement, plain object, or Three.js object. The functions provided
             * in VisualElementConfig allow us to interface with this instance.
             */
            var instance;
            /**
             * Manages the subscriptions for a visual element's lifecycle, for instance
             * onRender and onViewportBoxUpdate.
             */
            var lifecycles = createLifecycles();
            /**
             *
             */
            var projection = createProjectionState();
            /**
             * A reference to the nearest projecting parent. This is either
             * undefined if we haven't looked for the nearest projecting parent,
             * false if there is no parent performing layout projection, or a reference
             * to the projecting parent.
             */
            var projectionParent;
            /**
             * This is a reference to the visual state of the "lead" visual element.
             * Usually, this will be this visual element. But if it shares a layoutId
             * with other visual elements, only one of them will be designated lead by
             * AnimateSharedLayout. All the other visual elements will take on the visual
             * appearance of the lead while they crossfade to it.
             */
            var leadProjection = projection;
            var leadLatestValues = latestValues;
            var unsubscribeFromLeadVisualElement;
            /**
             * The latest layout measurements and calculated projections. This
             * is seperate from the target projection data in visualState as
             * many visual elements might point to the same piece of visualState as
             * a target, whereas they might each have different layouts and thus
             * projection calculations needed to project into the same viewport box.
             */
            var layoutState = createLayoutState();
            /**
             *
             */
            var crossfader;
            /**
             * Keep track of whether the viewport box has been updated since the
             * last time the layout projection was re-calculated.
             */
            var hasViewportBoxUpdated = false;
            /**
             * A map of all motion values attached to this visual element. Motion
             * values are source of truth for any given animated value. A motion
             * value might be provided externally by the component via props.
             */
            var values = new Map();
            /**
             * A map of every subscription that binds the provided or generated
             * motion values onChange listeners to this visual element.
             */
            var valueSubscriptions = new Map();
            /**
             * A reference to the previously-provided motion values as returned
             * from scrapeMotionValuesFromProps. We use the keys in here to determine
             * if any motion values need to be removed after props are updated.
             */
            var prevMotionValues = {};
            /**
             * x/y motion values that track the progress of initiated layout
             * animations.
             *
             * TODO: Target for removal
             */
            var projectionTargetProgress;
            /**
             * When values are removed from all animation props we need to search
             * for a fallback value to animate to. These values are tracked in baseTarget.
             */
            var baseTarget = __assign({}, latestValues);
            // Internal methods ========================
            /**
             * On mount, this will be hydrated with a callback to disconnect
             * this visual element from its parent on unmount.
             */
            var removeFromVariantTree;
            /**
             *
             */
            function render() {
                if (!instance)
                    return;
                if (element.isProjectionReady()) {
                    /**
                     * Apply the latest user-set transforms to the targetBox to produce the targetBoxFinal.
                     * This is the final box that we will then project into by calculating a transform delta and
                     * applying it to the corrected box.
                     */
                    applyBoxTransforms(leadProjection.targetFinal, leadProjection.target, leadLatestValues);
                    /**
                     * Update the delta between the corrected box and the final target box, after
                     * user-set transforms are applied to it. This will be used by the renderer to
                     * create a transform style that will reproject the element from its actual layout
                     * into the desired bounding box.
                     */
                    updateBoxDelta(layoutState.deltaFinal, layoutState.layoutCorrected, leadProjection.targetFinal, latestValues);
                }
                triggerBuild();
                renderInstance(instance, renderState);
            }
            function triggerBuild() {
                var valuesToRender = latestValues;
                if (crossfader && crossfader.isActive()) {
                    var crossfadedValues = crossfader.getCrossfadeState(element);
                    if (crossfadedValues)
                        valuesToRender = crossfadedValues;
                }
                build(element, renderState, valuesToRender, leadProjection, layoutState, options, props);
            }
            function update() {
                lifecycles.notifyUpdate(latestValues);
            }
            function updateLayoutProjection() {
                if (!element.isProjectionReady())
                    return;
                var delta = layoutState.delta, treeScale = layoutState.treeScale;
                var prevTreeScaleX = treeScale.x;
                var prevTreeScaleY = treeScale.y;
                var prevDeltaTransform = layoutState.deltaTransform;
                updateLayoutDeltas(layoutState, leadProjection, element.path, latestValues);
                hasViewportBoxUpdated &&
                    element.notifyViewportBoxUpdate(leadProjection.target, delta);
                hasViewportBoxUpdated = false;
                var deltaTransform = buildLayoutProjectionTransform(delta, treeScale);
                if (deltaTransform !== prevDeltaTransform ||
                    // Also compare calculated treeScale, for values that rely on this only for scale correction
                    prevTreeScaleX !== treeScale.x ||
                    prevTreeScaleY !== treeScale.y) {
                    element.scheduleRender();
                }
                layoutState.deltaTransform = deltaTransform;
            }
            function updateTreeLayoutProjection() {
                element.layoutTree.forEach(fireUpdateLayoutProjection);
            }
            /**
             *
             */
            function bindToMotionValue(key, value) {
                var removeOnChange = value.onChange(function (latestValue) {
                    latestValues[key] = latestValue;
                    props.onUpdate && sync.update(update, false, true);
                });
                var removeOnRenderRequest = value.onRenderRequest(element.scheduleRender);
                valueSubscriptions.set(key, function () {
                    removeOnChange();
                    removeOnRenderRequest();
                });
            }
            /**
             * Any motion values that are provided to the element when created
             * aren't yet bound to the element, as this would technically be impure.
             * However, we iterate through the motion values and set them to the
             * initial values for this component.
             *
             * TODO: This is impure and we should look at changing this to run on mount.
             * Doing so will break some tests but this isn't neccessarily a breaking change,
             * more a reflection of the test.
             */
            var initialMotionValues = scrapeMotionValuesFromProps(props);
            for (var key in initialMotionValues) {
                var value = initialMotionValues[key];
                if (latestValues[key] !== undefined && isMotionValue(value)) {
                    value.set(latestValues[key], false);
                }
            }
            /**
             * Determine what role this visual element should take in the variant tree.
             */
            var isControllingVariants = checkIfControllingVariants(props);
            var isVariantNode = checkIfVariantNode(props);
            var element = __assign(__assign({ treeType: treeType, 
                /**
                 * This is a mirror of the internal instance prop, which keeps
                 * VisualElement type-compatible with React's RefObject.
                 */
                current: null, 
                /**
                 * The depth of this visual element within the visual element tree.
                 */
                depth: parent ? parent.depth + 1 : 0, parent: parent, children: new Set(), 
                /**
                 * An ancestor path back to the root visual element. This is used
                 * by layout projection to quickly recurse back up the tree.
                 */
                path: parent ? __spreadArray(__spreadArray([], __read(parent.path)), [parent]) : [], layoutTree: parent ? parent.layoutTree : new FlatTree(), 
                /**
                 *
                 */
                presenceId: presenceId,
                projection: projection, 
                /**
                 * If this component is part of the variant tree, it should track
                 * any children that are also part of the tree. This is essentially
                 * a shadow tree to simplify logic around how to stagger over children.
                 */
                variantChildren: isVariantNode ? new Set() : undefined, 
                /**
                 * Whether this instance is visible. This can be changed imperatively
                 * by AnimateSharedLayout, is analogous to CSS's visibility in that
                 * hidden elements should take up layout, and needs enacting by the configured
                 * render function.
                 */
                isVisible: undefined, 
                /**
                 * Normally, if a component is controlled by a parent's variants, it can
                 * rely on that ancestor to trigger animations further down the tree.
                 * However, if a component is created after its parent is mounted, the parent
                 * won't trigger that mount animation so the child needs to.
                 *
                 * TODO: This might be better replaced with a method isParentMounted
                 */
                manuallyAnimateOnMount: Boolean(parent === null || parent === void 0 ? void 0 : parent.isMounted()), 
                /**
                 * This can be set by AnimatePresence to force components that mount
                 * at the same time as it to mount as if they have initial={false} set.
                 */
                blockInitialAnimation: blockInitialAnimation, 
                /**
                 * Determine whether this component has mounted yet. This is mostly used
                 * by variant children to determine whether they need to trigger their
                 * own animations on mount.
                 */
                isMounted: function () { return Boolean(instance); }, mount: function (newInstance) {
                    instance = element.current = newInstance;
                    element.pointTo(element);
                    if (isVariantNode && parent && !isControllingVariants) {
                        removeFromVariantTree = parent === null || parent === void 0 ? void 0 : parent.addVariantChild(element);
                    }
                    parent === null || parent === void 0 ? void 0 : parent.children.add(element);
                },
                /**
                 *
                 */
                unmount: function () {
                    cancelSync.update(update);
                    cancelSync.render(render);
                    cancelSync.preRender(element.updateLayoutProjection);
                    valueSubscriptions.forEach(function (remove) { return remove(); });
                    element.stopLayoutAnimation();
                    element.layoutTree.remove(element);
                    removeFromVariantTree === null || removeFromVariantTree === void 0 ? void 0 : removeFromVariantTree();
                    parent === null || parent === void 0 ? void 0 : parent.children.delete(element);
                    unsubscribeFromLeadVisualElement === null || unsubscribeFromLeadVisualElement === void 0 ? void 0 : unsubscribeFromLeadVisualElement();
                    lifecycles.clearAllListeners();
                },
                /**
                 * Add a child visual element to our set of children.
                 */
                addVariantChild: function (child) {
                    var _a;
                    var closestVariantNode = element.getClosestVariantNode();
                    if (closestVariantNode) {
                        (_a = closestVariantNode.variantChildren) === null || _a === void 0 ? void 0 : _a.add(child);
                        return function () { return closestVariantNode.variantChildren.delete(child); };
                    }
                },
                sortNodePosition: function (other) {
                    /**
                     * If these nodes aren't even of the same type we can't compare their depth.
                     */
                    if (!sortNodePosition || treeType !== other.treeType)
                        return 0;
                    return sortNodePosition(element.getInstance(), other.getInstance());
                }, 
                /**
                 * Returns the closest variant node in the tree starting from
                 * this visual element.
                 */
                getClosestVariantNode: function () {
                    return isVariantNode ? element : parent === null || parent === void 0 ? void 0 : parent.getClosestVariantNode();
                }, 
                /**
                 * A method that schedules an update to layout projections throughout
                 * the tree. We inherit from the parent so there's only ever one
                 * job scheduled on the next frame - that of the root visual element.
                 */
                scheduleUpdateLayoutProjection: parent
                    ? parent.scheduleUpdateLayoutProjection
                    : function () {
                        return sync.preRender(element.updateTreeLayoutProjection, false, true);
                    }, 
                /**
                 * Expose the latest layoutId prop.
                 */
                getLayoutId: function () { return props.layoutId; }, 
                /**
                 * Returns the current instance.
                 */
                getInstance: function () { return instance; }, 
                /**
                 * Get/set the latest static values.
                 */
                getStaticValue: function (key) { return latestValues[key]; }, setStaticValue: function (key, value) { return (latestValues[key] = value); }, 
                /**
                 * Returns the latest motion value state. Currently only used to take
                 * a snapshot of the visual element - perhaps this can return the whole
                 * visual state
                 */
                getLatestValues: function () { return latestValues; }, 
                /**
                 * Set the visiblity of the visual element. If it's changed, schedule
                 * a render to reflect these changes.
                 */
                setVisibility: function (visibility) {
                    if (element.isVisible === visibility)
                        return;
                    element.isVisible = visibility;
                    element.scheduleRender();
                },
                /**
                 * Make a target animatable by Popmotion. For instance, if we're
                 * trying to animate width from 100px to 100vw we need to measure 100vw
                 * in pixels to determine what we really need to animate to. This is also
                 * pluggable to support Framer's custom value types like Color,
                 * and CSS variables.
                 */
                makeTargetAnimatable: function (target, canMutate) {
                    if (canMutate === void 0) { canMutate = true; }
                    return makeTargetAnimatable(element, target, props, canMutate);
                },
                // Motion values ========================
                /**
                 * Add a motion value and bind it to this visual element.
                 */
                addValue: function (key, value) {
                    // Remove existing value if it exists
                    if (element.hasValue(key))
                        element.removeValue(key);
                    values.set(key, value);
                    latestValues[key] = value.get();
                    bindToMotionValue(key, value);
                },
                /**
                 * Remove a motion value and unbind any active subscriptions.
                 */
                removeValue: function (key) {
                    var _a;
                    values.delete(key);
                    (_a = valueSubscriptions.get(key)) === null || _a === void 0 ? void 0 : _a();
                    valueSubscriptions.delete(key);
                    delete latestValues[key];
                    removeValueFromRenderState(key, renderState);
                }, 
                /**
                 * Check whether we have a motion value for this key
                 */
                hasValue: function (key) { return values.has(key); }, 
                /**
                 * Get a motion value for this key. If called with a default
                 * value, we'll create one if none exists.
                 */
                getValue: function (key, defaultValue) {
                    var value = values.get(key);
                    if (value === undefined && defaultValue !== undefined) {
                        value = motionValue(defaultValue);
                        element.addValue(key, value);
                    }
                    return value;
                }, 
                /**
                 * Iterate over our motion values.
                 */
                forEachValue: function (callback) { return values.forEach(callback); }, 
                /**
                 * If we're trying to animate to a previously unencountered value,
                 * we need to check for it in our state and as a last resort read it
                 * directly from the instance (which might have performance implications).
                 */
                readValue: function (key) { var _a; return (_a = latestValues[key]) !== null && _a !== void 0 ? _a : readValueFromInstance(instance, key, options); }, 
                /**
                 * Set the base target to later animate back to. This is currently
                 * only hydrated on creation and when we first read a value.
                 */
                setBaseTarget: function (key, value) {
                    baseTarget[key] = value;
                },
                /**
                 * Find the base target for a value thats been removed from all animation
                 * props.
                 */
                getBaseTarget: function (key) {
                    if (getBaseTarget) {
                        var target = getBaseTarget(props, key);
                        if (target !== undefined && !isMotionValue(target))
                            return target;
                    }
                    return baseTarget[key];
                } }, lifecycles), { 
                /**
                 * Build the renderer state based on the latest visual state.
                 */
                build: function () {
                    triggerBuild();
                    return renderState;
                },
                /**
                 * Schedule a render on the next animation frame.
                 */
                scheduleRender: function () {
                    sync.render(render, false, true);
                }, 
                /**
                 * Synchronously fire render. It's prefered that we batch renders but
                 * in many circumstances, like layout measurement, we need to run this
                 * synchronously. However in those instances other measures should be taken
                 * to batch reads/writes.
                 */
                syncRender: render, 
                /**
                 * Update the provided props. Ensure any newly-added motion values are
                 * added to our map, old ones removed, and listeners updated.
                 */
                setProps: function (newProps) {
                    props = newProps;
                    lifecycles.updatePropListeners(newProps);
                    prevMotionValues = updateMotionValuesFromProps(element, scrapeMotionValuesFromProps(props), prevMotionValues);
                }, getProps: function () { return props; }, 
                // Variants ==============================
                /**
                 * Returns the variant definition with a given name.
                 */
                getVariant: function (name) { var _a; return (_a = props.variants) === null || _a === void 0 ? void 0 : _a[name]; }, 
                /**
                 * Returns the defined default transition on this component.
                 */
                getDefaultTransition: function () { return props.transition; }, 
                /**
                 * Used by child variant nodes to get the closest ancestor variant props.
                 */
                getVariantContext: function (startAtParent) {
                    if (startAtParent === void 0) { startAtParent = false; }
                    if (startAtParent)
                        return parent === null || parent === void 0 ? void 0 : parent.getVariantContext();
                    if (!isControllingVariants) {
                        var context_1 = (parent === null || parent === void 0 ? void 0 : parent.getVariantContext()) || {};
                        if (props.initial !== undefined) {
                            context_1.initial = props.initial;
                        }
                        return context_1;
                    }
                    var context = {};
                    for (var i = 0; i < numVariantProps; i++) {
                        var name_1 = variantProps[i];
                        var prop = props[name_1];
                        if (isVariantLabel(prop) || prop === false) {
                            context[name_1] = prop;
                        }
                    }
                    return context;
                },
                // Layout projection ==============================
                /**
                 * Enable layout projection for this visual element. Won't actually
                 * occur until we also have hydrated layout measurements.
                 */
                enableLayoutProjection: function () {
                    projection.isEnabled = true;
                    element.layoutTree.add(element);
                },
                /**
                 * Lock the projection target, for instance when dragging, so
                 * nothing else can try and animate it.
                 */
                lockProjectionTarget: function () {
                    projection.isTargetLocked = true;
                },
                unlockProjectionTarget: function () {
                    element.stopLayoutAnimation();
                    projection.isTargetLocked = false;
                }, getLayoutState: function () { return layoutState; }, setCrossfader: function (newCrossfader) {
                    crossfader = newCrossfader;
                }, isProjectionReady: function () {
                    return projection.isEnabled &&
                        projection.isHydrated &&
                        layoutState.isHydrated;
                }, 
                /**
                 * Start a layout animation on a given axis.
                 */
                startLayoutAnimation: function (axis, transition, isRelative) {
                    if (isRelative === void 0) { isRelative = false; }
                    var progress = element.getProjectionAnimationProgress()[axis];
                    var _a = isRelative
                        ? projection.relativeTarget[axis]
                        : projection.target[axis], min = _a.min, max = _a.max;
                    var length = max - min;
                    progress.clearListeners();
                    progress.set(min);
                    progress.set(min); // Set twice to hard-reset velocity
                    progress.onChange(function (v) {
                        element.setProjectionTargetAxis(axis, v, v + length, isRelative);
                    });
                    return element.animateMotionValue(axis, progress, 0, transition);
                },
                /**
                 * Stop layout animations.
                 */
                stopLayoutAnimation: function () {
                    eachAxis(function (axis) {
                        return element.getProjectionAnimationProgress()[axis].stop();
                    });
                },
                /**
                 * Measure the current viewport box with or without transforms.
                 * Only measures axis-aligned boxes, rotate and skew must be manually
                 * removed with a re-render to work.
                 */
                measureViewportBox: function (withTransform) {
                    if (withTransform === void 0) { withTransform = true; }
                    var viewportBox = measureViewportBox(instance, options);
                    if (!withTransform)
                        removeBoxTransforms(viewportBox, latestValues);
                    return viewportBox;
                },
                /**
                 * Get the motion values tracking the layout animations on each
                 * axis. Lazy init if not already created.
                 */
                getProjectionAnimationProgress: function () {
                    projectionTargetProgress || (projectionTargetProgress = {
                        x: motionValue(0),
                        y: motionValue(0),
                    });
                    return projectionTargetProgress;
                },
                /**
                 * Update the projection of a single axis. Schedule an update to
                 * the tree layout projection.
                 */
                setProjectionTargetAxis: function (axis, min, max, isRelative) {
                    if (isRelative === void 0) { isRelative = false; }
                    var target;
                    if (isRelative) {
                        if (!projection.relativeTarget) {
                            projection.relativeTarget = axisBox();
                        }
                        target = projection.relativeTarget[axis];
                    }
                    else {
                        projection.relativeTarget = undefined;
                        target = projection.target[axis];
                    }
                    projection.isHydrated = true;
                    target.min = min;
                    target.max = max;
                    // Flag that we want to fire the onViewportBoxUpdate event handler
                    hasViewportBoxUpdated = true;
                    lifecycles.notifySetAxisTarget();
                },
                /**
                 * Rebase the projection target on top of the provided viewport box
                 * or the measured layout. This ensures that non-animating elements
                 * don't fall out of sync differences in measurements vs projections
                 * after a page scroll or other relayout.
                 */
                rebaseProjectionTarget: function (force, box) {
                    if (box === void 0) { box = layoutState.layout; }
                    var _a = element.getProjectionAnimationProgress(), x = _a.x, y = _a.y;
                    var shouldRebase = !projection.relativeTarget &&
                        !projection.isTargetLocked &&
                        !x.isAnimating() &&
                        !y.isAnimating();
                    if (force || shouldRebase) {
                        eachAxis(function (axis) {
                            var _a = box[axis], min = _a.min, max = _a.max;
                            element.setProjectionTargetAxis(axis, min, max);
                        });
                    }
                },
                /**
                 * Notify the visual element that its layout is up-to-date.
                 * Currently Animate.tsx uses this to check whether a layout animation
                 * needs to be performed.
                 */
                notifyLayoutReady: function (config) {
                    setCurrentViewportBox(element);
                    element.notifyLayoutUpdate(layoutState.layout, element.prevViewportBox || layoutState.layout, config);
                }, 
                /**
                 * Temporarily reset the transform of the instance.
                 */
                resetTransform: function () { return resetTransform(element, instance, props); }, restoreTransform: function () { return restoreTransform(instance, renderState); }, updateLayoutProjection: updateLayoutProjection,
                updateTreeLayoutProjection: function () {
                    element.layoutTree.forEach(fireResolveRelativeTargetBox);
                    /**
                     * Schedule the projection updates at the end of the current preRender
                     * step. This will ensure that all layout trees will first resolve
                     * relative projection boxes into viewport boxes, and *then*
                     * update projections.
                     */
                    sync.preRender(updateTreeLayoutProjection, false, true);
                    // sync.postRender(() => element.scheduleUpdateLayoutProjection())
                },
                getProjectionParent: function () {
                    if (projectionParent === undefined) {
                        var foundParent = false;
                        // Search backwards through the tree path
                        for (var i = element.path.length - 1; i >= 0; i--) {
                            var ancestor = element.path[i];
                            if (ancestor.projection.isEnabled) {
                                foundParent = ancestor;
                                break;
                            }
                        }
                        projectionParent = foundParent;
                    }
                    return projectionParent;
                },
                resolveRelativeTargetBox: function () {
                    var relativeParent = element.getProjectionParent();
                    if (!projection.relativeTarget || !relativeParent)
                        return;
                    calcRelativeBox(projection, relativeParent.projection);
                    if (isDraggable(relativeParent)) {
                        var target = projection.target;
                        applyBoxTransforms(target, target, relativeParent.getLatestValues());
                    }
                },
                shouldResetTransform: function () {
                    return Boolean(props._layoutResetTransform);
                },
                /**
                 *
                 */
                pointTo: function (newLead) {
                    leadProjection = newLead.projection;
                    leadLatestValues = newLead.getLatestValues();
                    /**
                     * Subscribe to lead component's layout animations
                     */
                    unsubscribeFromLeadVisualElement === null || unsubscribeFromLeadVisualElement === void 0 ? void 0 : unsubscribeFromLeadVisualElement();
                    unsubscribeFromLeadVisualElement = pipe(newLead.onSetAxisTarget(element.scheduleUpdateLayoutProjection), newLead.onLayoutAnimationComplete(function () {
                        var _a;
                        if (element.isPresent) {
                            element.presence = Presence.Present;
                        }
                        else {
                            (_a = element.layoutSafeToRemove) === null || _a === void 0 ? void 0 : _a.call(element);
                        }
                    }));
                }, 
                // TODO: Clean this up
                isPresent: true, presence: Presence.Entering });
            return element;
        };
    };
    function fireResolveRelativeTargetBox(child) {
        child.resolveRelativeTargetBox();
    }
    function fireUpdateLayoutProjection(child) {
        child.updateLayoutProjection();
    }
    var variantProps = __spreadArray(["initial"], __read(variantPriorityOrder));
    var numVariantProps = variantProps.length;

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */
    /**
     * A list of all valid MotionProps.
     *
     * @internalremarks
     * This doesn't throw if a `MotionProp` name is missing - it should.
     */
    var validMotionProps = new Set([
        "initial",
        "animate",
        "exit",
        "style",
        "variants",
        "transition",
        "transformTemplate",
        "transformValues",
        "custom",
        "inherit",
        "layout",
        "layoutId",
        "onLayoutAnimationComplete",
        "onViewportBoxUpdate",
        "onLayoutMeasure",
        "onBeforeLayoutMeasure",
        "onAnimationStart",
        "onAnimationComplete",
        "onUpdate",
        "onDragStart",
        "onDrag",
        "onDragEnd",
        "onMeasureDragConstraints",
        "onDirectionLock",
        "onDragTransitionEnd",
        "drag",
        "dragControls",
        "dragListener",
        "dragConstraints",
        "dragDirectionLock",
        "_dragX",
        "_dragY",
        "dragElastic",
        "dragMomentum",
        "dragPropagation",
        "dragTransition",
        "whileDrag",
        "onPan",
        "onPanStart",
        "onPanEnd",
        "onPanSessionStart",
        "onTap",
        "onTapStart",
        "onTapCancel",
        "onHoverStart",
        "onHoverEnd",
        "whileFocus",
        "whileTap",
        "whileHover",
    ]);
    /**
     * Check whether a prop name is a valid `MotionProp` key.
     *
     * @param key - Name of the property to check
     * @returns `true` is key is a valid `MotionProp`.
     *
     * @public
     */
    function isValidMotionProp(key) {
        return validMotionProps.has(key);
    }

    /**
     * @public
     */
    const PresenceContext = (c)=> getDomContext("Presence",c)||writable(null);

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    let counter = 0;
    const incrementId = () => counter++;

    function isPresent(context) {
        return context === null ? true : context.isPresent
    }

    const usePresence = (isCustom=false) => {

        const context = getContext(PresenceContext)||PresenceContext(isCustom);
        const id = get_store_value(context) === null ? undefined : incrementId();
        onMount(()=>{
            if (get_store_value(context)!==null){
                get_store_value(context).register(id);
            }
        });

        if (get_store_value(context) === null){
            return readable([true,null]);
        }
        return derived(context,$v=>
            (!$v.isPresent && $v.onExitComplete) ? 
                [false, ()=>$v.onExitComplete?.(id)] :
                [true]
        )
    };

    /**
     * @internal
     */
    const LayoutGroupContext = (c)=>getDomContext("LayoutGroup",c)||writable(null);

    /** 
    based on framer-motion@4.1.11,
    Copyright (c) 2018 Framer B.V.
    */

    function isProjecting(visualElement) {
        var isEnabled = visualElement.projection.isEnabled;
        return isEnabled || visualElement.shouldResetTransform();
    }
    function collectProjectingAncestors(visualElement, ancestors) {
        if (ancestors === void 0) { ancestors = []; }
        var parent = visualElement.parent;
        if (parent)
            collectProjectingAncestors(parent, ancestors);
        if (isProjecting(visualElement))
            ancestors.push(visualElement);
        return ancestors;
    }
    function collectProjectingChildren(visualElement) {
        var children = [];
        var addChild = function (child) {
            if (isProjecting(child))
                children.push(child);
            child.children.forEach(addChild);
        };
        visualElement.children.forEach(addChild);
        return children.sort(compareByDepth);
    }
    /**
     * Update the layoutState by measuring the DOM layout. This
     * should be called after resetting any layout-affecting transforms.
     */
    function updateLayoutMeasurement(visualElement) {
        if (visualElement.shouldResetTransform())
            return;
        var layoutState = visualElement.getLayoutState();
        visualElement.notifyBeforeLayoutMeasure(layoutState.layout);
        layoutState.isHydrated = true;
        layoutState.layout = visualElement.measureViewportBox();
        layoutState.layoutCorrected = copyAxisBox(layoutState.layout);
        visualElement.notifyLayoutMeasure(layoutState.layout, visualElement.prevViewportBox || layoutState.layout);
        sync.update(function () { return visualElement.rebaseProjectionTarget(); });
    }
    /**
     * Record the viewport box as it was before an expected mutation/re-render
     */
    function snapshotViewportBox(visualElement,nc) {
        if (visualElement.shouldResetTransform())
            return;
        if (!nc) visualElement.prevViewportBox = visualElement.measureViewportBox(false);
        /**
         * Update targetBox to match the prevViewportBox. This is just to ensure
         * that targetBox is affected by scroll in the same way as the measured box
         */
        visualElement.rebaseProjectionTarget(false, visualElement.prevViewportBox);
    }

    /** 
    based on framer-motion@4.1.15,
    Copyright (c) 2018 Framer B.V.
    */

    var unresolvedJobs = new Set();
    function pushJob(stack, job, pointer) {
        if (!stack[pointer])
            stack[pointer] = [];
        stack[pointer].push(job);
    }
    function batchLayout(callback) {
        unresolvedJobs.add(callback);
        return function () { return unresolvedJobs.delete(callback); };
    }
    function flushLayout() {
        if (!unresolvedJobs.size)
            return;
        var pointer = 0;
        var reads = [[]];
        var writes = [];
        var setRead = function (job) { return pushJob(reads, job, pointer); };
        var setWrite = function (job) {
            pushJob(writes, job, pointer);
            pointer++;
        };
        /**
         * Resolve jobs into their array stacks
         */
        unresolvedJobs.forEach(function (callback) {
            callback(setRead, setWrite);
            pointer = 0;
        });
        unresolvedJobs.clear();
        sync.postRender(function () {
            setTimeout(function () { return (false); }, 10);
        });
        /**
         * Execute jobs
         */
        var numStacks = writes.length;
        for (var i = 0; i <= numStacks; i++) {
            reads[i] && reads[i].forEach(executeJob);
            writes[i] && writes[i].forEach(executeJob);
        }
    }
    var executeJob = function (job) { return job(); };

    /** 
    based on framer-motion@4.1.15,
    Copyright (c) 2018 Framer B.V.
    */

    /**
     * Default handlers for batching VisualElements
     */
    var defaultHandler = {
        layoutReady: function (child) { return child.notifyLayoutReady(); },
    };
    /**
     * Create a batcher to process VisualElements
     */
    function createBatcher() {
        var queue = new Set();
        return {
            add: function (child) { return queue.add(child); },
            flush: function (_a) {
                var _b = _a === void 0 ? defaultHandler : _a, layoutReady = _b.layoutReady, parent = _b.parent;
                batchLayout(function (read, write) {
                    var order = Array.from(queue).sort(compareByDepth);
                    var ancestors = parent
                        ? collectProjectingAncestors(parent)
                        : [];
                    write(function () {
                        var allElements = __spreadArray(__spreadArray([], __read(ancestors)), __read(order));
                        allElements.forEach(function (element) { return element.resetTransform(); });
                    });
                    read(function () {
                        order.forEach(updateLayoutMeasurement);
                    });
                    write(function () {
                        ancestors.forEach(function (element) { return element.restoreTransform(); });
                        order.forEach(layoutReady);
                    });
                    read(function () {
                        /**
                         * After all children have started animating, ensure any Entering components are set to Present.
                         * If we add deferred animations (set up all animations and then start them in two loops) this
                         * could be moved to the start loop. But it needs to happen after all the animations configs
                         * are generated in AnimateSharedLayout as this relies on presence data
                         */
                        order.forEach(function (child) {
                            if (child.isPresent)
                                child.presence = Presence.Present;
                        });
                    });
                    write(function () {
                        /**
                         * Starting these animations will have queued jobs on the frame loop. In some situations,
                         * like when removing an element, these will be processed too late after the DOM is manipulated,
                         * leaving a flash of incorrectly-projected content. By manually flushing these jobs
                         * we ensure there's no flash.
                         */
                        flushSync.preRender();
                        flushSync.render();
                    });
                    read(function () {
                        /**
                         * Schedule a callback at the end of the following frame to assign the latest projection
                         * box to the prevViewportBox snapshot. Once global batching is in place this could be run
                         * synchronously. But for now it ensures that if any nested `AnimateSharedLayout` top-level
                         * child attempts to calculate its previous relative position against a prevViewportBox
                         * it will be against its latest projection box instead, as the snapshot is useless beyond this
                         * render.
                         */
                        sync.postRender(function () {
                            return order.forEach(assignProjectionToSnapshot);
                        });
                        queue.clear();
                    });
                });
                // TODO: Need to find a layout-synchronous way of flushing this
                flushLayout();
            },
        };
    }
    function assignProjectionToSnapshot(child) {
        child.prevViewportBox = child.projection.target;
    }

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    var SharedLayoutContext = (custom) => getDomContext("SharedLayout",custom)||writable(createBatcher());
    /**
     * @internal
     */
    var FramerTreeLayoutContext = ()=> writable(createBatcher());

    function isSharedLayout(context) {
        return !!context.forceUpdate;
    }

    const LazyContext = (c) => getDomContext("Lazy",c) || writable({ strict: false });

    /* node_modules\svelte-motion\src\context\MotionContext\MotionContext.svelte generated by Svelte v3.55.1 */

    const MotionContext = c => getDomContext("Motion", c) || writable({});

    /* node_modules\svelte-motion\src\motion\utils\UseVisualElement.svelte generated by Svelte v3.55.1 */

    const get_default_slot_changes$9 = dirty => ({
    	visualElement: dirty & /*visualElement*/ 1
    });

    const get_default_slot_context$9 = ctx => ({ visualElement: /*visualElement*/ ctx[0] });

    function create_fragment$o(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], get_default_slot_context$9);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, visualElement*/ 262145)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, get_default_slot_changes$9),
    						get_default_slot_context$9
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const ssr = false;

    function instance$o($$self, $$props, $$invalidate) {
    	let $presenceContext;
    	let $config;
    	let $lazyContext;
    	let $layoutGroupId;
    	let $mc;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UseVisualElement', slots, ['default']);
    	let { createVisualElement = undefined, props, Component, visualState, isCustom } = $$props;
    	const config = getContext(MotionConfigContext) || MotionConfigContext(isCustom);
    	validate_store(config, 'config');
    	component_subscribe($$self, config, value => $$invalidate(15, $config = value));
    	const presenceContext = getContext(PresenceContext) || PresenceContext(isCustom);
    	validate_store(presenceContext, 'presenceContext');
    	component_subscribe($$self, presenceContext, value => $$invalidate(14, $presenceContext = value));
    	const lazyContext = getContext(LazyContext) || LazyContext(isCustom);
    	validate_store(lazyContext, 'lazyContext');
    	component_subscribe($$self, lazyContext, value => $$invalidate(20, $lazyContext = value));
    	const mc = getContext(MotionContext) || MotionContext(isCustom);
    	validate_store(mc, 'mc');
    	component_subscribe($$self, mc, value => $$invalidate(17, $mc = value));
    	let parent = get_store_value(mc).visualElement;
    	const layoutGroupId = getContext(LayoutGroupContext) || LayoutGroupContext(isCustom);
    	validate_store(layoutGroupId, 'layoutGroupId');
    	component_subscribe($$self, layoutGroupId, value => $$invalidate(16, $layoutGroupId = value));

    	let layoutId = $layoutGroupId && props.layoutId !== undefined
    	? $layoutGroupId + "-" + props.layoutId
    	: props.layoutId;

    	let visualElementRef = undefined;

    	/**
     * If we haven't preloaded a renderer, check to see if we have one lazy-loaded
     */
    	if (!createVisualElement) {
    		createVisualElement = $lazyContext.renderer;
    	}

    	let visualElement = visualElementRef;

    	afterUpdate(() => {
    		tick().then(() => {
    			visualElement.animationState?.animateChanges();
    		});
    	});

    	onDestroy(() => {
    		visualElement?.notifyUnmount();
    	});

    	$$self.$$.on_mount.push(function () {
    		if (props === undefined && !('props' in $$props || $$self.$$.bound[$$self.$$.props['props']])) {
    			console.warn("<UseVisualElement> was created without expected prop 'props'");
    		}

    		if (Component === undefined && !('Component' in $$props || $$self.$$.bound[$$self.$$.props['Component']])) {
    			console.warn("<UseVisualElement> was created without expected prop 'Component'");
    		}

    		if (visualState === undefined && !('visualState' in $$props || $$self.$$.bound[$$self.$$.props['visualState']])) {
    			console.warn("<UseVisualElement> was created without expected prop 'visualState'");
    		}

    		if (isCustom === undefined && !('isCustom' in $$props || $$self.$$.bound[$$self.$$.props['isCustom']])) {
    			console.warn("<UseVisualElement> was created without expected prop 'isCustom'");
    		}
    	});

    	const writable_props = ['createVisualElement', 'props', 'Component', 'visualState', 'isCustom'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UseVisualElement> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('createVisualElement' in $$props) $$invalidate(6, createVisualElement = $$props.createVisualElement);
    		if ('props' in $$props) $$invalidate(7, props = $$props.props);
    		if ('Component' in $$props) $$invalidate(8, Component = $$props.Component);
    		if ('visualState' in $$props) $$invalidate(9, visualState = $$props.visualState);
    		if ('isCustom' in $$props) $$invalidate(10, isCustom = $$props.isCustom);
    		if ('$$scope' in $$props) $$invalidate(18, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		ssr,
    		afterUpdate,
    		getContext,
    		onDestroy,
    		tick,
    		PresenceContext,
    		LazyContext,
    		MotionConfigContext,
    		LayoutGroupContext,
    		MotionContext,
    		isPresent,
    		get: get_store_value,
    		createVisualElement,
    		props,
    		Component,
    		visualState,
    		isCustom,
    		config,
    		presenceContext,
    		lazyContext,
    		mc,
    		parent,
    		layoutGroupId,
    		layoutId,
    		visualElementRef,
    		visualElement,
    		$presenceContext,
    		$config,
    		$lazyContext,
    		$layoutGroupId,
    		$mc
    	});

    	$$self.$inject_state = $$props => {
    		if ('createVisualElement' in $$props) $$invalidate(6, createVisualElement = $$props.createVisualElement);
    		if ('props' in $$props) $$invalidate(7, props = $$props.props);
    		if ('Component' in $$props) $$invalidate(8, Component = $$props.Component);
    		if ('visualState' in $$props) $$invalidate(9, visualState = $$props.visualState);
    		if ('isCustom' in $$props) $$invalidate(10, isCustom = $$props.isCustom);
    		if ('parent' in $$props) $$invalidate(11, parent = $$props.parent);
    		if ('layoutId' in $$props) $$invalidate(12, layoutId = $$props.layoutId);
    		if ('visualElementRef' in $$props) $$invalidate(13, visualElementRef = $$props.visualElementRef);
    		if ('visualElement' in $$props) $$invalidate(0, visualElement = $$props.visualElement);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$mc*/ 131072) {
    			$$invalidate(11, parent = $mc.visualElement);
    		}

    		if ($$self.$$.dirty & /*$layoutGroupId, props*/ 65664) {
    			$$invalidate(12, layoutId = $layoutGroupId && props.layoutId !== undefined
    			? $layoutGroupId + "-" + props.layoutId
    			: props.layoutId);
    		}

    		if ($$self.$$.dirty & /*visualElementRef, createVisualElement, Component, visualState, parent, props, layoutId, $presenceContext*/ 31680) {
    			if (!visualElementRef && createVisualElement) {
    				$$invalidate(13, visualElementRef = createVisualElement(Component, {
    					visualState,
    					parent,
    					props: { ...props, layoutId },
    					presenceId: $presenceContext?.id,
    					blockInitialAnimation: $presenceContext?.initial === false
    				}));
    			}
    		}

    		if ($$self.$$.dirty & /*visualElementRef*/ 8192) {
    			$$invalidate(0, visualElement = visualElementRef);
    		}

    		if ($$self.$$.dirty & /*visualElement, $config, props, layoutId, $presenceContext, parent*/ 55425) {
    			if (visualElement) {
    				visualElement.setProps({ ...$config, ...props, layoutId });
    				$$invalidate(0, visualElement.isPresent = isPresent($presenceContext), visualElement);
    				$$invalidate(0, visualElement.isPresenceRoot = !parent || parent.presenceId !== $presenceContext?.id, visualElement);

    				/**
     * Fire a render to ensure the latest state is reflected on-screen.
     */
    				visualElement.syncRender();
    			}
    		}
    	};

    	return [
    		visualElement,
    		config,
    		presenceContext,
    		lazyContext,
    		mc,
    		layoutGroupId,
    		createVisualElement,
    		props,
    		Component,
    		visualState,
    		isCustom,
    		parent,
    		layoutId,
    		visualElementRef,
    		$presenceContext,
    		$config,
    		$layoutGroupId,
    		$mc,
    		$$scope,
    		slots
    	];
    }

    class UseVisualElement extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {
    			createVisualElement: 6,
    			props: 7,
    			Component: 8,
    			visualState: 9,
    			isCustom: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UseVisualElement",
    			options,
    			id: create_fragment$o.name
    		});
    	}

    	get createVisualElement() {
    		throw new Error("<UseVisualElement>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set createVisualElement(value) {
    		throw new Error("<UseVisualElement>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get props() {
    		throw new Error("<UseVisualElement>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set props(value) {
    		throw new Error("<UseVisualElement>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get Component() {
    		throw new Error("<UseVisualElement>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set Component(value) {
    		throw new Error("<UseVisualElement>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get visualState() {
    		throw new Error("<UseVisualElement>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set visualState(value) {
    		throw new Error("<UseVisualElement>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isCustom() {
    		throw new Error("<UseVisualElement>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isCustom(value) {
    		throw new Error("<UseVisualElement>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var UseVisualElement$1 = UseVisualElement;

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    var createDefinition = function (propNames) { return ({
        isEnabled: function (props) { return propNames.some(function (name) { return !!props[name]; }); },
    }); };
    var featureDefinitions = {
        measureLayout: createDefinition(["layout", "layoutId", "drag"]),
        animation: createDefinition([
            "animate",
            "exit",
            "variants",
            "whileHover",
            "whileTap",
            "whileFocus",
            "whileDrag",
        ]),
        exit: createDefinition(["exit"]),
        drag: createDefinition(["drag", "dragControls"]),
        focus: createDefinition(["whileFocus"]),
        hover: createDefinition(["whileHover", "onHoverStart", "onHoverEnd"]),
        tap: createDefinition(["whileTap", "onTap", "onTapStart", "onTapCancel"]),
        pan: createDefinition([
            "onPan",
            "onPanStart",
            "onPanSessionStart",
            "onPanEnd",
        ]),
        layoutAnimation: createDefinition(["layout", "layoutId"]),
    };
    function loadFeatures(features) {
        for (var key in features) {
            var Component = features[key];
            if (Component !== null){
                featureDefinitions[key].Component = Component;
            }
        }
    }

    /* node_modules\svelte-motion\src\motion\features\UseFeatures.svelte generated by Svelte v3.55.1 */

    const { Object: Object_1$1 } = globals;
    const get_default_slot_changes$8 = dirty => ({ features: dirty & /*features*/ 2 });
    const get_default_slot_context$8 = ctx => ({ features: /*features*/ ctx[1] });

    // (40:0) {#if visualElement}
    function create_if_block$2(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], get_default_slot_context$8);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, features*/ 10)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, get_default_slot_changes$8),
    						get_default_slot_context$8
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(40:0) {#if visualElement}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$n(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*visualElement*/ ctx[0] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*visualElement*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*visualElement*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UseFeatures', slots, ['default']);
    	const featureNames = Object.keys(featureDefinitions);
    	const numFeatures = featureNames.length;
    	let { visualElement, props } = $$props;
    	let features = [];

    	$$self.$$.on_mount.push(function () {
    		if (visualElement === undefined && !('visualElement' in $$props || $$self.$$.bound[$$self.$$.props['visualElement']])) {
    			console.warn("<UseFeatures> was created without expected prop 'visualElement'");
    		}

    		if (props === undefined && !('props' in $$props || $$self.$$.bound[$$self.$$.props['props']])) {
    			console.warn("<UseFeatures> was created without expected prop 'props'");
    		}
    	});

    	const writable_props = ['visualElement', 'props'];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UseFeatures> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('visualElement' in $$props) $$invalidate(0, visualElement = $$props.visualElement);
    		if ('props' in $$props) $$invalidate(2, props = $$props.props);
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		featureDefinitions,
    		featureNames,
    		numFeatures,
    		visualElement,
    		props,
    		features
    	});

    	$$self.$inject_state = $$props => {
    		if ('visualElement' in $$props) $$invalidate(0, visualElement = $$props.visualElement);
    		if ('props' in $$props) $$invalidate(2, props = $$props.props);
    		if ('features' in $$props) $$invalidate(1, features = $$props.features);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*props, features, visualElement*/ 7) {
    			// If this is a static component, or we're rendering on the server, we don't load
    			// any feature components
    			// Decide which features we should render and add them to the returned array
    			{
    				$$invalidate(1, features = []);

    				for (let i = 0; i < numFeatures; i++) {
    					const name = featureNames[i];
    					const { isEnabled, Component } = featureDefinitions[name];

    					/**
     * It might be possible in the future to use this moment to
     * dynamically request functionality. In initial tests this
     * was producing a lot of duplication amongst bundles.
     */
    					if (isEnabled(props) && Component) {
    						features.push({
    							Component,
    							key: name,
    							props,
    							visualElement
    						});
    					}
    				}
    			}
    		}
    	};

    	return [visualElement, features, props, $$scope, slots];
    }

    class UseFeatures extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, { visualElement: 0, props: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UseFeatures",
    			options,
    			id: create_fragment$n.name
    		});
    	}

    	get visualElement() {
    		throw new Error("<UseFeatures>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set visualElement(value) {
    		throw new Error("<UseFeatures>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get props() {
    		throw new Error("<UseFeatures>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set props(value) {
    		throw new Error("<UseFeatures>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var UseFeatures$1 = UseFeatures;

    /* node_modules\svelte-motion\src\context\MotionContext\MotionContextProvider.svelte generated by Svelte v3.55.1 */

    function create_fragment$m(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MotionContextProvider', slots, ['default']);
    	let { value, isCustom } = $$props;
    	let store = writable(value);
    	setContext(MotionContext, store);
    	setDomContext("Motion", isCustom, store);

    	// Since useMotionRef is not called on destroy, the visual element is unmounted here
    	onDestroy(() => {
    		value?.visualElement?.unmount();
    	});

    	$$self.$$.on_mount.push(function () {
    		if (value === undefined && !('value' in $$props || $$self.$$.bound[$$self.$$.props['value']])) {
    			console.warn("<MotionContextProvider> was created without expected prop 'value'");
    		}

    		if (isCustom === undefined && !('isCustom' in $$props || $$self.$$.bound[$$self.$$.props['isCustom']])) {
    			console.warn("<MotionContextProvider> was created without expected prop 'isCustom'");
    		}
    	});

    	const writable_props = ['value', 'isCustom'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MotionContextProvider> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('isCustom' in $$props) $$invalidate(1, isCustom = $$props.isCustom);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onDestroy,
    		setContext,
    		writable,
    		setDomContext,
    		MotionContext,
    		value,
    		isCustom,
    		store
    	});

    	$$self.$inject_state = $$props => {
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('isCustom' in $$props) $$invalidate(1, isCustom = $$props.isCustom);
    		if ('store' in $$props) $$invalidate(4, store = $$props.store);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*value*/ 1) {
    			store.set(value);
    		}
    	};

    	return [value, isCustom, $$scope, slots];
    }

    class MotionContextProvider extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, { value: 0, isCustom: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MotionContextProvider",
    			options,
    			id: create_fragment$m.name
    		});
    	}

    	get value() {
    		throw new Error("<MotionContextProvider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<MotionContextProvider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isCustom() {
    		throw new Error("<MotionContextProvider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isCustom(value) {
    		throw new Error("<MotionContextProvider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var MotionContextProvider$1 = MotionContextProvider;

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */
    var createHtmlRenderState = function () { return ({
        style: {},
        transform: {},
        transformKeys: [],
        transformOrigin: {},
        vars: {},
    }); };

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    var createSvgRenderState = function () { return (__assign(__assign({}, createHtmlRenderState()), { attrs: {} })); };

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    /**
     * A list of all transformable axes. We'll use this list to generated a version
     * of each axes for each transform.
     */
    var transformAxes = ["", "X", "Y", "Z"];
    /**
     * An ordered array of each transformable value. By default, transform values
     * will be sorted to this order.
     */
    var order = ["translate", "scale", "rotate", "skew"];
    /**
     * Generate a list of every possible transform key.
     */
    var transformProps = ["transformPerspective", "x", "y", "z"];
    order.forEach(function (operationKey) {
        return transformAxes.forEach(function (axesKey) {
            return transformProps.push(operationKey + axesKey);
        });
    });
    /**
     * A function to use with Array.sort to sort transform keys by their default order.
     */
    function sortTransformProps(a, b) {
        return transformProps.indexOf(a) - transformProps.indexOf(b);
    }
    /**
     * A quick lookup for transform props.
     */
    var transformPropSet = new Set(transformProps);
    function isTransformProp(key) {
        return transformPropSet.has(key);
    }
    /**
     * A quick lookup for transform origin props
     */
    var transformOriginProps = new Set(["originX", "originY", "originZ"]);
    function isTransformOriginProp(key) {
        return transformOriginProps.has(key);
    }

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    function isForcedMotionValue(key, _a) {
        var layout = _a.layout, layoutId = _a.layoutId;
        return (isTransformProp(key) ||
            isTransformOriginProp(key) ||
            ((layout || layoutId !== undefined) && !!valueScaleCorrection[key]));
    }

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    var translateAlias = {
        x: "translateX",
        y: "translateY",
        z: "translateZ",
        transformPerspective: "perspective",
    };
    /**
     * Build a CSS transform style from individual x/y/scale etc properties.
     *
     * This outputs with a default order of transforms/scales/rotations, this can be customised by
     * providing a transformTemplate function.
     */
    function buildTransform(_a, _b, transformIsDefault, transformTemplate) {
        var transform = _a.transform, transformKeys = _a.transformKeys;
        var _c = _b.enableHardwareAcceleration, enableHardwareAcceleration = _c === void 0 ? true : _c, _d = _b.allowTransformNone, allowTransformNone = _d === void 0 ? true : _d;
        // The transform string we're going to build into.
        var transformString = "";
        // Transform keys into their default order - this will determine the output order.
        transformKeys.sort(sortTransformProps);
        // Track whether the defined transform has a defined z so we don't add a
        // second to enable hardware acceleration
        var transformHasZ = false;
        // Loop over each transform and build them into transformString
        var numTransformKeys = transformKeys.length;
        for (var i = 0; i < numTransformKeys; i++) {
            var key = transformKeys[i];
            transformString += (translateAlias[key] || key) + "(" + transform[key] + ") ";
            if (key === "z")
                transformHasZ = true;
        }
        if (!transformHasZ && enableHardwareAcceleration) {
            transformString += "translateZ(0)";
        }
        else {
            transformString = transformString.trim();
        }
        // If we have a custom `transform` template, pass our transform values and
        // generated transformString to that before returning
        if (transformTemplate) {
            transformString = transformTemplate(transform, transformIsDefault ? "" : transformString);
        }
        else if (allowTransformNone && transformIsDefault) {
            transformString = "none";
        }
        return transformString;
    }
    /**
     * Build a transformOrigin style. Uses the same defaults as the browser for
     * undefined origins.
     */
    function buildTransformOrigin(_a) {
        var _b = _a.originX, originX = _b === void 0 ? "50%" : _b, _c = _a.originY, originY = _c === void 0 ? "50%" : _c, _d = _a.originZ, originZ = _d === void 0 ? 0 : _d;
        return originX + " " + originY + " " + originZ;
    }

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */
    /**
     * Returns true if the provided key is a CSS variable
     */
    function isCSSVariable$1(key) {
        return key.startsWith("--");
    }

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */
    /**
     * Provided a value and a ValueType, returns the value as that value type.
     */
    var getValueAsType = function (value, type) {
        return type && typeof value === "number"
            ? type.transform(value)
            : value;
    };

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    function buildHTMLStyles(state, latestValues, projection, layoutState, options, transformTemplate, buildProjectionTransform, buildProjectionTransformOrigin) {
        var _a;
        var style = state.style, vars = state.vars, transform = state.transform, transformKeys = state.transformKeys, transformOrigin = state.transformOrigin;
        // Empty the transformKeys array. As we're throwing out refs to its items
        // this might not be as cheap as suspected. Maybe using the array as a buffer
        // with a manual incrementation would be better.
        transformKeys.length = 0;
        // Track whether we encounter any transform or transformOrigin values.
        var hasTransform = false;
        var hasTransformOrigin = false;
        // Does the calculated transform essentially equal "none"?
        var transformIsNone = true;
        /**
         * Loop over all our latest animated values and decide whether to handle them
         * as a style or CSS variable.
         *
         * Transforms and transform origins are kept seperately for further processing.
         */
        for (var key in latestValues) {
            var value = latestValues[key];
            /**
             * If this is a CSS variable we don't do any further processing.
             */
            if (isCSSVariable$1(key)) {
                vars[key] = value;
                continue;
            }
            // Convert the value to its default value type, ie 0 -> "0px"
            var valueType = numberValueTypes[key];
            var valueAsType = getValueAsType(value, valueType);
            if (isTransformProp(key)) {
                // If this is a transform, flag to enable further transform processing
                hasTransform = true;
                transform[key] = valueAsType;
                transformKeys.push(key);
                // If we already know we have a non-default transform, early return
                if (!transformIsNone)
                    continue;
                // Otherwise check to see if this is a default transform
                if (value !== ((_a = valueType.default) !== null && _a !== void 0 ? _a : 0))
                    transformIsNone = false;
            }
            else if (isTransformOriginProp(key)) {
                transformOrigin[key] = valueAsType;
                // If this is a transform origin, flag and enable further transform-origin processing
                hasTransformOrigin = true;
            }
            else {
                /**
                 * If layout projection is on, and we need to perform scale correction for this
                 * value type, perform it.
                 */
                if (layoutState &&
                    projection &&
                    layoutState.isHydrated &&
                    valueScaleCorrection[key]) {
                    var correctedValue = valueScaleCorrection[key].process(value, layoutState, projection);
                    /**
                     * Scale-correctable values can define a number of other values to break
                     * down into. For instance borderRadius needs applying to borderBottomLeftRadius etc
                     */
                    var applyTo = valueScaleCorrection[key].applyTo;
                    if (applyTo) {
                        var num = applyTo.length;
                        for (var i = 0; i < num; i++) {
                            style[applyTo[i]] = correctedValue;
                        }
                    }
                    else {
                        style[key] = correctedValue;
                    }
                }
                else {
                    style[key] = valueAsType;
                }
            }
        }
        if (layoutState &&
            projection &&
            buildProjectionTransform &&
            buildProjectionTransformOrigin) {
            style.transform = buildProjectionTransform(layoutState.deltaFinal, layoutState.treeScale, hasTransform ? transform : undefined);
            if (transformTemplate) {
                style.transform = transformTemplate(transform, style.transform);
            }
            style.transformOrigin = buildProjectionTransformOrigin(layoutState);
        }
        else {
            if (hasTransform) {
                style.transform = buildTransform(state, options, transformIsNone, transformTemplate);
            }
            if (hasTransformOrigin) {
                style.transformOrigin = buildTransformOrigin(transformOrigin);
            }
        }
    }

    /* node_modules\svelte-motion\src\render\html\UseInitialMotionValues.svelte generated by Svelte v3.55.1 */
    const get_default_slot_changes$7 = dirty => ({ styles: dirty & /*styles*/ 1 });
    const get_default_slot_context$7 = ctx => ({ styles: /*styles*/ ctx[0] });

    function create_fragment$l(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], get_default_slot_context$7);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, styles*/ 17)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, get_default_slot_changes$7),
    						get_default_slot_context$7
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let styles;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UseInitialMotionValues', slots, ['default']);
    	let { visualState, isStatic, props } = $$props;

    	const memo = () => {
    		let state = createHtmlRenderState();
    		buildHTMLStyles(state, visualState, undefined, undefined, { enableHardwareAcceleration: !isStatic }, props.transformTemplate);
    		const { vars, style } = state;
    		return { ...vars, ...style };
    	};

    	$$self.$$.on_mount.push(function () {
    		if (visualState === undefined && !('visualState' in $$props || $$self.$$.bound[$$self.$$.props['visualState']])) {
    			console.warn("<UseInitialMotionValues> was created without expected prop 'visualState'");
    		}

    		if (isStatic === undefined && !('isStatic' in $$props || $$self.$$.bound[$$self.$$.props['isStatic']])) {
    			console.warn("<UseInitialMotionValues> was created without expected prop 'isStatic'");
    		}

    		if (props === undefined && !('props' in $$props || $$self.$$.bound[$$self.$$.props['props']])) {
    			console.warn("<UseInitialMotionValues> was created without expected prop 'props'");
    		}
    	});

    	const writable_props = ['visualState', 'isStatic', 'props'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UseInitialMotionValues> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('visualState' in $$props) $$invalidate(1, visualState = $$props.visualState);
    		if ('isStatic' in $$props) $$invalidate(2, isStatic = $$props.isStatic);
    		if ('props' in $$props) $$invalidate(3, props = $$props.props);
    		if ('$$scope' in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		buildHTMLStyles,
    		createHtmlRenderState,
    		visualState,
    		isStatic,
    		props,
    		memo,
    		styles
    	});

    	$$self.$inject_state = $$props => {
    		if ('visualState' in $$props) $$invalidate(1, visualState = $$props.visualState);
    		if ('isStatic' in $$props) $$invalidate(2, isStatic = $$props.isStatic);
    		if ('props' in $$props) $$invalidate(3, props = $$props.props);
    		if ('styles' in $$props) $$invalidate(0, styles = $$props.styles);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*visualState*/ 2) {
    			$$invalidate(0, styles = memo());
    		}
    	};

    	return [styles, visualState, isStatic, props, $$scope, slots];
    }

    class UseInitialMotionValues extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, { visualState: 1, isStatic: 2, props: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UseInitialMotionValues",
    			options,
    			id: create_fragment$l.name
    		});
    	}

    	get visualState() {
    		throw new Error("<UseInitialMotionValues>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set visualState(value) {
    		throw new Error("<UseInitialMotionValues>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isStatic() {
    		throw new Error("<UseInitialMotionValues>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isStatic(value) {
    		throw new Error("<UseInitialMotionValues>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get props() {
    		throw new Error("<UseInitialMotionValues>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set props(value) {
    		throw new Error("<UseInitialMotionValues>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var UseInitialMotionValues$1 = UseInitialMotionValues;

    /* node_modules\svelte-motion\src\render\html\UseStyle.svelte generated by Svelte v3.55.1 */

    const { Object: Object_1 } = globals;
    const get_default_slot_changes$6 = dirty => ({ styles: dirty & /*s1, props, style*/ 522 });

    const get_default_slot_context$6 = ctx => ({
    	styles: /*toStyle*/ ctx[4](/*s1*/ ctx[9], /*props*/ ctx[1], /*style*/ ctx[3])
    });

    // (41:0) <UseInitialMotionValues {props} {visualState} {isStatic} let:styles={s1}>
    function create_default_slot$7(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], get_default_slot_context$6);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, s1, props, style*/ 650)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, get_default_slot_changes$6),
    						get_default_slot_context$6
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(41:0) <UseInitialMotionValues {props} {visualState} {isStatic} let:styles={s1}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let useinitialmotionvalues;
    	let current;

    	useinitialmotionvalues = new UseInitialMotionValues$1({
    			props: {
    				props: /*props*/ ctx[1],
    				visualState: /*visualState*/ ctx[0],
    				isStatic: /*isStatic*/ ctx[2],
    				$$slots: {
    					default: [
    						create_default_slot$7,
    						({ styles: s1 }) => ({ 9: s1 }),
    						({ styles: s1 }) => s1 ? 512 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(useinitialmotionvalues.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(useinitialmotionvalues, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const useinitialmotionvalues_changes = {};
    			if (dirty & /*props*/ 2) useinitialmotionvalues_changes.props = /*props*/ ctx[1];
    			if (dirty & /*visualState*/ 1) useinitialmotionvalues_changes.visualState = /*visualState*/ ctx[0];
    			if (dirty & /*isStatic*/ 4) useinitialmotionvalues_changes.isStatic = /*isStatic*/ ctx[2];

    			if (dirty & /*$$scope, s1, props, style*/ 650) {
    				useinitialmotionvalues_changes.$$scope = { dirty, ctx };
    			}

    			useinitialmotionvalues.$set(useinitialmotionvalues_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(useinitialmotionvalues.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(useinitialmotionvalues.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(useinitialmotionvalues, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function copyRawValuesOnly(target, source, props) {
    	for (const key in source) {
    		if (!isMotionValue(source[key]) && !isForcedMotionValue(key, props)) {
    			target[key] = source[key];
    		}
    	}
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let styleProp;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UseStyle', slots, ['default']);
    	let { visualState, props, isStatic } = $$props;
    	let style = {};

    	/**
     * Copy non-Motion Values straight into style
     */
    	const cRVO = copyRawValuesOnly;

    	const toStyle = s1 => {
    		Object.assign(style, s1);

    		if (props.transformValues) {
    			$$invalidate(3, style = props.transformValues(style));
    		}

    		return style;
    	};

    	$$self.$$.on_mount.push(function () {
    		if (visualState === undefined && !('visualState' in $$props || $$self.$$.bound[$$self.$$.props['visualState']])) {
    			console.warn("<UseStyle> was created without expected prop 'visualState'");
    		}

    		if (props === undefined && !('props' in $$props || $$self.$$.bound[$$self.$$.props['props']])) {
    			console.warn("<UseStyle> was created without expected prop 'props'");
    		}

    		if (isStatic === undefined && !('isStatic' in $$props || $$self.$$.bound[$$self.$$.props['isStatic']])) {
    			console.warn("<UseStyle> was created without expected prop 'isStatic'");
    		}
    	});

    	const writable_props = ['visualState', 'props', 'isStatic'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UseStyle> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('visualState' in $$props) $$invalidate(0, visualState = $$props.visualState);
    		if ('props' in $$props) $$invalidate(1, props = $$props.props);
    		if ('isStatic' in $$props) $$invalidate(2, isStatic = $$props.isStatic);
    		if ('$$scope' in $$props) $$invalidate(7, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		copyRawValuesOnly,
    		isMotionValue,
    		isForcedMotionValue,
    		UseInitialMotionValues: UseInitialMotionValues$1,
    		visualState,
    		props,
    		isStatic,
    		style,
    		cRVO,
    		toStyle,
    		styleProp
    	});

    	$$self.$inject_state = $$props => {
    		if ('visualState' in $$props) $$invalidate(0, visualState = $$props.visualState);
    		if ('props' in $$props) $$invalidate(1, props = $$props.props);
    		if ('isStatic' in $$props) $$invalidate(2, isStatic = $$props.isStatic);
    		if ('style' in $$props) $$invalidate(3, style = $$props.style);
    		if ('styleProp' in $$props) $$invalidate(5, styleProp = $$props.styleProp);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*props*/ 2) {
    			$$invalidate(5, styleProp = props.style || {});
    		}

    		if ($$self.$$.dirty & /*style, styleProp, props*/ 42) {
    			cRVO(style, styleProp, props);
    		}
    	};

    	return [visualState, props, isStatic, style, toStyle, styleProp, slots, $$scope];
    }

    class UseStyle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, { visualState: 0, props: 1, isStatic: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UseStyle",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get visualState() {
    		throw new Error("<UseStyle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set visualState(value) {
    		throw new Error("<UseStyle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get props() {
    		throw new Error("<UseStyle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set props(value) {
    		throw new Error("<UseStyle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isStatic() {
    		throw new Error("<UseStyle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isStatic(value) {
    		throw new Error("<UseStyle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var UseStyle$1 = UseStyle;

    /* node_modules\svelte-motion\src\render\html\UseHTMLProps.svelte generated by Svelte v3.55.1 */

    const get_default_slot_changes$5 = dirty => ({
    	visualProps: dirty & /*styles, props*/ 65
    });

    const get_default_slot_context$5 = ctx => ({
    	visualProps: /*getHTMLProps*/ ctx[3](/*styles*/ ctx[6], /*props*/ ctx[0])
    });

    // (36:0) <UseStyle let:styles {visualState} {props} {isStatic}>
    function create_default_slot$6(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], get_default_slot_context$5);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, styles, props*/ 97)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, get_default_slot_changes$5),
    						get_default_slot_context$5
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(36:0) <UseStyle let:styles {visualState} {props} {isStatic}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let usestyle;
    	let current;

    	usestyle = new UseStyle$1({
    			props: {
    				visualState: /*visualState*/ ctx[1],
    				props: /*props*/ ctx[0],
    				isStatic: /*isStatic*/ ctx[2],
    				$$slots: {
    					default: [
    						create_default_slot$6,
    						({ styles }) => ({ 6: styles }),
    						({ styles }) => styles ? 64 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(usestyle.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(usestyle, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const usestyle_changes = {};
    			if (dirty & /*visualState*/ 2) usestyle_changes.visualState = /*visualState*/ ctx[1];
    			if (dirty & /*props*/ 1) usestyle_changes.props = /*props*/ ctx[0];
    			if (dirty & /*isStatic*/ 4) usestyle_changes.isStatic = /*isStatic*/ ctx[2];

    			if (dirty & /*$$scope, styles, props*/ 97) {
    				usestyle_changes.$$scope = { dirty, ctx };
    			}

    			usestyle.$set(usestyle_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(usestyle.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(usestyle.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(usestyle, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UseHTMLProps', slots, ['default']);
    	let { props, visualState, isStatic } = $$props;

    	const getHTMLProps = (style, props) => {
    		let htmlProps = {};

    		if (Boolean(props.drag)) {
    			// Disable the ghost element when a user drags
    			htmlProps.draggable = false;

    			// Disable text selection
    			style.userSelect = style.WebkitUserSelect = style.WebkitTouchCallout = "none";

    			// Disable scrolling on the draggable direction
    			style.touchAction = props.drag === true
    			? "none"
    			: `pan-${props.drag === "x" ? "y" : "x"}`;
    		}

    		htmlProps.style = style;
    		return htmlProps;
    	};

    	$$self.$$.on_mount.push(function () {
    		if (props === undefined && !('props' in $$props || $$self.$$.bound[$$self.$$.props['props']])) {
    			console.warn("<UseHTMLProps> was created without expected prop 'props'");
    		}

    		if (visualState === undefined && !('visualState' in $$props || $$self.$$.bound[$$self.$$.props['visualState']])) {
    			console.warn("<UseHTMLProps> was created without expected prop 'visualState'");
    		}

    		if (isStatic === undefined && !('isStatic' in $$props || $$self.$$.bound[$$self.$$.props['isStatic']])) {
    			console.warn("<UseHTMLProps> was created without expected prop 'isStatic'");
    		}
    	});

    	const writable_props = ['props', 'visualState', 'isStatic'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UseHTMLProps> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('props' in $$props) $$invalidate(0, props = $$props.props);
    		if ('visualState' in $$props) $$invalidate(1, visualState = $$props.visualState);
    		if ('isStatic' in $$props) $$invalidate(2, isStatic = $$props.isStatic);
    		if ('$$scope' in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		UseStyle: UseStyle$1,
    		props,
    		visualState,
    		isStatic,
    		getHTMLProps
    	});

    	$$self.$inject_state = $$props => {
    		if ('props' in $$props) $$invalidate(0, props = $$props.props);
    		if ('visualState' in $$props) $$invalidate(1, visualState = $$props.visualState);
    		if ('isStatic' in $$props) $$invalidate(2, isStatic = $$props.isStatic);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [props, visualState, isStatic, getHTMLProps, slots, $$scope];
    }

    class UseHTMLProps extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, { props: 0, visualState: 1, isStatic: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UseHTMLProps",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get props() {
    		throw new Error("<UseHTMLProps>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set props(value) {
    		throw new Error("<UseHTMLProps>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get visualState() {
    		throw new Error("<UseHTMLProps>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set visualState(value) {
    		throw new Error("<UseHTMLProps>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isStatic() {
    		throw new Error("<UseHTMLProps>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isStatic(value) {
    		throw new Error("<UseHTMLProps>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var UseHTMLProps$1 = UseHTMLProps;

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    function calcOrigin(origin, offset, size) {
        return typeof origin === "string"
            ? origin
            : px.transform(offset + size * origin);
    }
    /**
     * The SVG transform origin defaults are different to CSS and is less intuitive,
     * so we use the measured dimensions of the SVG to reconcile these.
     */
    function calcSVGTransformOrigin(dimensions, originX, originY) {
        var pxOriginX = calcOrigin(originX, dimensions.x, dimensions.width);
        var pxOriginY = calcOrigin(originY, dimensions.y, dimensions.height);
        return pxOriginX + " " + pxOriginY;
    }

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    // Convert a progress 0-1 to a pixels value based on the provided length
    var progressToPixels = function (progress, length) {
        return px.transform(progress * length);
    };
    var dashKeys = {
        offset: "stroke-dashoffset",
        array: "stroke-dasharray",
    };
    var camelKeys = {
        offset: "strokeDashoffset",
        array: "strokeDasharray",
    };
    /**
     * Build SVG path properties. Uses the path's measured length to convert
     * our custom pathLength, pathSpacing and pathOffset into stroke-dashoffset
     * and stroke-dasharray attributes.
     *
     * This function is mutative to reduce per-frame GC.
     */
    function buildSVGPath(attrs, totalLength, length, spacing, offset, useDashCase) {
        if (spacing === void 0) { spacing = 1; }
        if (offset === void 0) { offset = 0; }
        if (useDashCase === void 0) { useDashCase = true; }
        // We use dash case when setting attributes directly to the DOM node and camel case
        // when defining props on a React component.
        var keys = useDashCase ? dashKeys : camelKeys;
        // Build the dash offset
        attrs[keys.offset] = progressToPixels(-offset, totalLength);
        // Build the dash array
        var pathLength = progressToPixels(length, totalLength);
        var pathSpacing = progressToPixels(spacing, totalLength);
        attrs[keys.array] = pathLength + " " + pathSpacing;
    }

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    /**
     * Build SVG visual attrbutes, like cx and style.transform
     */
    function buildSVGAttrs(state, _a, projection, layoutState, options, transformTemplate, buildProjectionTransform, buildProjectionTransformOrigin) {
        var attrX = _a.attrX, attrY = _a.attrY, originX = _a.originX, originY = _a.originY, pathLength = _a.pathLength, _b = _a.pathSpacing, pathSpacing = _b === void 0 ? 1 : _b, _c = _a.pathOffset, pathOffset = _c === void 0 ? 0 : _c, 
        // This is object creation, which we try to avoid per-frame.
        latest = __rest(_a, ["attrX", "attrY", "originX", "originY", "pathLength", "pathSpacing", "pathOffset"]);
        buildHTMLStyles(state, latest, projection, layoutState, options, transformTemplate, buildProjectionTransform, buildProjectionTransformOrigin);
        state.attrs = state.style;
        state.style = {};
        var attrs = state.attrs, style = state.style, dimensions = state.dimensions, totalPathLength = state.totalPathLength;
        /**
         * However, we apply transforms as CSS transforms. So if we detect a transform we take it from attrs
         * and copy it into style.
         */
        if (attrs.transform) {
            if (dimensions)
                style.transform = attrs.transform;
            delete attrs.transform;
        }
        // Parse transformOrigin
        if (dimensions &&
            (originX !== undefined || originY !== undefined || style.transform)) {
            style.transformOrigin = calcSVGTransformOrigin(dimensions, originX !== undefined ? originX : 0.5, originY !== undefined ? originY : 0.5);
        }
        // Treat x/y not as shortcuts but as actual attributes
        if (attrX !== undefined)
            attrs.x = attrX;
        if (attrY !== undefined)
            attrs.y = attrY;
        // Build SVG path if one has been measured
        if (totalPathLength !== undefined && pathLength !== undefined) {
            buildSVGPath(attrs, totalPathLength, pathLength, pathSpacing, pathOffset, false);
        }
    }

    /* node_modules\svelte-motion\src\render\svg\UseSVGProps.svelte generated by Svelte v3.55.1 */
    const get_default_slot_changes$4 = dirty => ({ visualProps: dirty & /*visualProps*/ 1 });
    const get_default_slot_context$4 = ctx => ({ visualProps: /*visualProps*/ ctx[0] });

    function create_fragment$i(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], get_default_slot_context$4);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, visualProps*/ 9)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, get_default_slot_changes$4),
    						get_default_slot_context$4
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let visualProps;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UseSVGProps', slots, ['default']);
    	let { visualState, props } = $$props;

    	let memo = () => {
    		const state = createSvgRenderState();
    		buildSVGAttrs(state, visualState, undefined, undefined, { enableHardwareAcceleration: false }, props.transformTemplate);

    		return {
    			...state.attrs,
    			style: { ...state.style }
    		};
    	};

    	$$self.$$.on_mount.push(function () {
    		if (visualState === undefined && !('visualState' in $$props || $$self.$$.bound[$$self.$$.props['visualState']])) {
    			console.warn("<UseSVGProps> was created without expected prop 'visualState'");
    		}

    		if (props === undefined && !('props' in $$props || $$self.$$.bound[$$self.$$.props['props']])) {
    			console.warn("<UseSVGProps> was created without expected prop 'props'");
    		}
    	});

    	const writable_props = ['visualState', 'props'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UseSVGProps> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('visualState' in $$props) $$invalidate(1, visualState = $$props.visualState);
    		if ('props' in $$props) $$invalidate(2, props = $$props.props);
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createSvgRenderState,
    		copyRawValuesOnly,
    		buildSVGAttrs,
    		visualState,
    		props,
    		memo,
    		visualProps
    	});

    	$$self.$inject_state = $$props => {
    		if ('visualState' in $$props) $$invalidate(1, visualState = $$props.visualState);
    		if ('props' in $$props) $$invalidate(2, props = $$props.props);
    		if ('memo' in $$props) $$invalidate(5, memo = $$props.memo);
    		if ('visualProps' in $$props) $$invalidate(0, visualProps = $$props.visualProps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*visualState*/ 2) {
    			$$invalidate(0, visualProps = memo(visualState));
    		}

    		if ($$self.$$.dirty & /*props, visualProps*/ 5) {
    			if (props.style) {
    				const rawStyles = {};
    				copyRawValuesOnly(rawStyles, props.style, props);
    				$$invalidate(0, visualProps.style = { ...rawStyles, ...visualProps.style }, visualProps);
    			}
    		}
    	};

    	return [visualProps, visualState, props, $$scope, slots];
    }

    class UseSVGProps extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, { visualState: 1, props: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UseSVGProps",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get visualState() {
    		throw new Error("<UseSVGProps>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set visualState(value) {
    		throw new Error("<UseSVGProps>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get props() {
    		throw new Error("<UseSVGProps>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set props(value) {
    		throw new Error("<UseSVGProps>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var UseSVGProps$1 = UseSVGProps;

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    var shouldForward = function (key) { return !isValidMotionProp(key); };
    /**
     * Emotion and Styled Components both allow users to pass through arbitrary props to their components
     * to dynamically generate CSS. They both use the `@emotion/is-prop-valid` package to determine which
     * of these should be passed to the underlying DOM node.
     *
     * However, when styling a Motion component `styled(MotionDiv)`, both packages pass through *all* props
     * as it's seen as an arbitrary component rather than a DOM node. Motion only allows arbitrary props
     * passed through the `custom` prop so it doesn't *need* the payload or computational overhead of
     * `@emotion/is-prop-valid`, however to fix this problem we need to use it.
     *
     * By making it an optionalDependency we can offer this functionality only in the situations where it's
     * actually required.
     */
    try {
        var emotionIsPropValid_1 = require("@emotion/is-prop-valid").default;
        shouldForward = function (key) {
            // Handle events explicitly as Emotion validates them all as true
            if (key.startsWith("on")) {
                return !isValidMotionProp(key);
            }
            else {
                return emotionIsPropValid_1(key);
            }
        };
    }
    catch (_a) {
        // We don't need to actually do anything here - the fallback is the existing `isPropValid`.
    }
    function filterProps(props, isDom, forwardMotionProps) {
        var filteredProps = {};
        for (var key in props) {
            if (shouldForward(key) ||
                (forwardMotionProps === true && isValidMotionProp(key)) ||
                (!isDom && !isValidMotionProp(key))) {
                filteredProps[key] = props[key];
            }
        }
        return filteredProps;
    }

    /* node_modules\svelte-motion\src\render\dom\UseRender.svelte generated by Svelte v3.55.1 */

    const get_default_slot_changes$3 = dirty => ({
    	props: dirty & /*filteredProps, visualProps*/ 2064
    });

    const get_default_slot_context$3 = ctx => ({
    	motion: /*motion*/ ctx[5],
    	props: {
    		.../*filteredProps*/ ctx[4],
    		.../*visualProps*/ ctx[11]
    	}
    });

    // (33:0) <svelte:component     this={Component === 'SVG' ? UseSVGProps : UseHTMLProps}     {visualState}     {isStatic}     {props}     let:visualProps>
    function create_default_slot$5(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], get_default_slot_context$3);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, filteredProps, visualProps*/ 3088)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[10],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[10])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[10], dirty, get_default_slot_changes$3),
    						get_default_slot_context$3
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(33:0) <svelte:component     this={Component === 'SVG' ? UseSVGProps : UseHTMLProps}     {visualState}     {isStatic}     {props}     let:visualProps>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	var switch_value = /*Component*/ ctx[2] === 'SVG'
    	? UseSVGProps$1
    	: UseHTMLProps$1;

    	function switch_props(ctx) {
    		return {
    			props: {
    				visualState: /*visualState*/ ctx[1],
    				isStatic: /*isStatic*/ ctx[3],
    				props: /*props*/ ctx[0],
    				$$slots: {
    					default: [
    						create_default_slot$5,
    						({ visualProps }) => ({ 11: visualProps }),
    						({ visualProps }) => visualProps ? 2048 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_instance_changes = {};
    			if (dirty & /*visualState*/ 2) switch_instance_changes.visualState = /*visualState*/ ctx[1];
    			if (dirty & /*isStatic*/ 8) switch_instance_changes.isStatic = /*isStatic*/ ctx[3];
    			if (dirty & /*props*/ 1) switch_instance_changes.props = /*props*/ ctx[0];

    			if (dirty & /*$$scope, filteredProps, visualProps*/ 3088) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*Component*/ ctx[2] === 'SVG'
    			? UseSVGProps$1
    			: UseHTMLProps$1)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let filteredProps;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UseRender', slots, ['default']);
    	let { props, visualState, Component, forwardMotionProps = false, isStatic, ref, targetEl = undefined } = $$props;

    	const motion = node => {
    		ref(node);
    	};

    	$$self.$$.on_mount.push(function () {
    		if (props === undefined && !('props' in $$props || $$self.$$.bound[$$self.$$.props['props']])) {
    			console.warn("<UseRender> was created without expected prop 'props'");
    		}

    		if (visualState === undefined && !('visualState' in $$props || $$self.$$.bound[$$self.$$.props['visualState']])) {
    			console.warn("<UseRender> was created without expected prop 'visualState'");
    		}

    		if (Component === undefined && !('Component' in $$props || $$self.$$.bound[$$self.$$.props['Component']])) {
    			console.warn("<UseRender> was created without expected prop 'Component'");
    		}

    		if (isStatic === undefined && !('isStatic' in $$props || $$self.$$.bound[$$self.$$.props['isStatic']])) {
    			console.warn("<UseRender> was created without expected prop 'isStatic'");
    		}

    		if (ref === undefined && !('ref' in $$props || $$self.$$.bound[$$self.$$.props['ref']])) {
    			console.warn("<UseRender> was created without expected prop 'ref'");
    		}
    	});

    	const writable_props = [
    		'props',
    		'visualState',
    		'Component',
    		'forwardMotionProps',
    		'isStatic',
    		'ref',
    		'targetEl'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UseRender> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('props' in $$props) $$invalidate(0, props = $$props.props);
    		if ('visualState' in $$props) $$invalidate(1, visualState = $$props.visualState);
    		if ('Component' in $$props) $$invalidate(2, Component = $$props.Component);
    		if ('forwardMotionProps' in $$props) $$invalidate(6, forwardMotionProps = $$props.forwardMotionProps);
    		if ('isStatic' in $$props) $$invalidate(3, isStatic = $$props.isStatic);
    		if ('ref' in $$props) $$invalidate(7, ref = $$props.ref);
    		if ('targetEl' in $$props) $$invalidate(8, targetEl = $$props.targetEl);
    		if ('$$scope' in $$props) $$invalidate(10, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		UseSVGProps: UseSVGProps$1,
    		UseHTMLProps: UseHTMLProps$1,
    		filterProps,
    		props,
    		visualState,
    		Component,
    		forwardMotionProps,
    		isStatic,
    		ref,
    		targetEl,
    		motion,
    		filteredProps
    	});

    	$$self.$inject_state = $$props => {
    		if ('props' in $$props) $$invalidate(0, props = $$props.props);
    		if ('visualState' in $$props) $$invalidate(1, visualState = $$props.visualState);
    		if ('Component' in $$props) $$invalidate(2, Component = $$props.Component);
    		if ('forwardMotionProps' in $$props) $$invalidate(6, forwardMotionProps = $$props.forwardMotionProps);
    		if ('isStatic' in $$props) $$invalidate(3, isStatic = $$props.isStatic);
    		if ('ref' in $$props) $$invalidate(7, ref = $$props.ref);
    		if ('targetEl' in $$props) $$invalidate(8, targetEl = $$props.targetEl);
    		if ('filteredProps' in $$props) $$invalidate(4, filteredProps = $$props.filteredProps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*props, Component, forwardMotionProps*/ 69) {
    			$$invalidate(4, filteredProps = filterProps(props, typeof Component === "string", forwardMotionProps));
    		}

    		if ($$self.$$.dirty & /*targetEl*/ 256) {
    			if (targetEl) {
    				motion(targetEl);
    			}
    		}
    	};

    	return [
    		props,
    		visualState,
    		Component,
    		isStatic,
    		filteredProps,
    		motion,
    		forwardMotionProps,
    		ref,
    		targetEl,
    		slots,
    		$$scope
    	];
    }

    class UseRender extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {
    			props: 0,
    			visualState: 1,
    			Component: 2,
    			forwardMotionProps: 6,
    			isStatic: 3,
    			ref: 7,
    			targetEl: 8
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UseRender",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get props() {
    		throw new Error("<UseRender>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set props(value) {
    		throw new Error("<UseRender>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get visualState() {
    		throw new Error("<UseRender>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set visualState(value) {
    		throw new Error("<UseRender>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get Component() {
    		throw new Error("<UseRender>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set Component(value) {
    		throw new Error("<UseRender>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get forwardMotionProps() {
    		throw new Error("<UseRender>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set forwardMotionProps(value) {
    		throw new Error("<UseRender>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isStatic() {
    		throw new Error("<UseRender>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isStatic(value) {
    		throw new Error("<UseRender>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<UseRender>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<UseRender>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get targetEl() {
    		throw new Error("<UseRender>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set targetEl(value) {
    		throw new Error("<UseRender>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var UseRender$1 = UseRender;

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    /**
     * Measure and return the element bounding box.
     *
     * We convert the box into an AxisBox2D to make it easier to work with each axis
     * individually and programmatically.
     *
     * This function optionally accepts a transformPagePoint function which allows us to compensate
     * for, for instance, measuring the element within a scaled plane like a Framer devivce preview component.
     */
    function getBoundingBox(element, transformPagePoint) {
        var box = element.getBoundingClientRect();
        return convertBoundingBoxToAxisBox(transformBoundingBox(box, transformPagePoint));
    }

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */
    //import { invariant } from 'hey-listen';

    function isCSSVariable(value) {
        return typeof value === "string" && value.startsWith("var(--");
    }
    /**
     * Parse Framer's special CSS variable format into a CSS token and a fallback.
     *
     * ```
     * `var(--foo, #fff)` => [`--foo`, '#fff']
     * ```
     *
     * @param current
     */
    var cssVariableRegex = /var\((--[a-zA-Z0-9-_]+),? ?([a-zA-Z0-9 ()%#.,-]+)?\)/;
    function parseCSSVariable(current) {
        var match = cssVariableRegex.exec(current);
        if (!match)
            return [,];
        var _a = __read(match, 3), token = _a[1], fallback = _a[2];
        return [token, fallback];
    }
    function getVariableValue(current, element, depth) {
        //invariant(depth <= maxDepth, "Max CSS variable fallback depth detected in property \"" + current + "\". This may indicate a circular fallback dependency.");
        var _a = __read(parseCSSVariable(current), 2), token = _a[0], fallback = _a[1];
        // No CSS variable detected
        if (!token)
            return;
        // Attempt to read this CSS variable off the element
        var resolved = window.getComputedStyle(element).getPropertyValue(token);
        if (resolved) {
            return resolved.trim();
        }
        else if (isCSSVariable(fallback)) {
            // The fallback might itself be a CSS variable, in which case we attempt to resolve it too.
            return getVariableValue(fallback, element);
        }
        else {
            return fallback;
        }
    }
    /**
     * Resolve CSS variables from
     *
     * @internal
     */
    function resolveCSSVariables(visualElement, _a, transitionEnd) {
        var _b;
        var target = __rest(_a, []);
        var element = visualElement.getInstance();
        if (!(element instanceof HTMLElement))
            return { target: target, transitionEnd: transitionEnd };
        // If `transitionEnd` isn't `undefined`, clone it. We could clone `target` and `transitionEnd`
        // only if they change but I think this reads clearer and this isn't a performance-critical path.
        if (transitionEnd) {
            transitionEnd = __assign({}, transitionEnd);
        }
        // Go through existing `MotionValue`s and ensure any existing CSS variables are resolved
        visualElement.forEachValue(function (value) {
            var current = value.get();
            if (!isCSSVariable(current))
                return;
            var resolved = getVariableValue(current, element);
            if (resolved)
                value.set(resolved);
        });
        // Cycle through every target property and resolve CSS variables. Currently
        // we only read single-var properties like `var(--foo)`, not `calc(var(--foo) + 20px)`
        for (var key in target) {
            var current = target[key];
            if (!isCSSVariable(current))
                continue;
            var resolved = getVariableValue(current, element);
            if (!resolved)
                continue;
            // Clone target if it hasn't already been
            target[key] = resolved;
            // If the user hasn't already set this key on `transitionEnd`, set it to the unresolved
            // CSS variable. This will ensure that after the animation the component will reflect
            // changes in the value of the CSS variable.
            if (transitionEnd)
                (_b = transitionEnd[key]) !== null && _b !== void 0 ? _b : (transitionEnd[key] = current);
        }
        return { target: target, transitionEnd: transitionEnd };
    }

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    var positionalKeys = new Set([
        "width",
        "height",
        "top",
        "left",
        "right",
        "bottom",
        "x",
        "y",
    ]);
    var isPositionalKey = function (key) { return positionalKeys.has(key); };
    var hasPositionalKey = function (target) {
        return Object.keys(target).some(isPositionalKey);
    };
    var setAndResetVelocity = function (value, to) {
        // Looks odd but setting it twice doesn't render, it'll just
        // set both prev and current to the latest value
        value.set(to, false);
        value.set(to);
    };
    var isNumOrPxType = function (v) {
        return v === number || v === px;
    };
    var BoundingBoxDimension;
    (function (BoundingBoxDimension) {
        BoundingBoxDimension["width"] = "width";
        BoundingBoxDimension["height"] = "height";
        BoundingBoxDimension["left"] = "left";
        BoundingBoxDimension["right"] = "right";
        BoundingBoxDimension["top"] = "top";
        BoundingBoxDimension["bottom"] = "bottom";
    })(BoundingBoxDimension || (BoundingBoxDimension = {}));
    var getPosFromMatrix = function (matrix, pos) {
        return parseFloat(matrix.split(", ")[pos]);
    };
    var getTranslateFromMatrix = function (pos2, pos3) { return function (_bbox, _a) {
        var transform = _a.transform;
        if (transform === "none" || !transform)
            return 0;
        var matrix3d = transform.match(/^matrix3d\((.+)\)$/);
        if (matrix3d) {
            return getPosFromMatrix(matrix3d[1], pos3);
        }
        else {
            var matrix = transform.match(/^matrix\((.+)\)$/);
            if (matrix) {
                return getPosFromMatrix(matrix[1], pos2);
            }
            else {
                return 0;
            }
        }
    }; };
    var transformKeys = new Set(["x", "y", "z"]);
    var nonTranslationalTransformKeys = transformProps.filter(function (key) { return !transformKeys.has(key); });
    function removeNonTranslationalTransform(visualElement) {
        var removedTransforms = [];
        nonTranslationalTransformKeys.forEach(function (key) {
            var value = visualElement.getValue(key);
            if (value !== undefined) {
                removedTransforms.push([key, value.get()]);
                value.set(key.startsWith("scale") ? 1 : 0);
            }
        });
        // Apply changes to element before measurement
        if (removedTransforms.length)
            visualElement.syncRender();
        return removedTransforms;
    }
    var positionalValues = {
        // Dimensions
        width: function (_a) {
            var x = _a.x;
            return x.max - x.min;
        },
        height: function (_a) {
            var y = _a.y;
            return y.max - y.min;
        },
        top: function (_bbox, _a) {
            var top = _a.top;
            return parseFloat(top);
        },
        left: function (_bbox, _a) {
            var left = _a.left;
            return parseFloat(left);
        },
        bottom: function (_a, _b) {
            var y = _a.y;
            var top = _b.top;
            return parseFloat(top) + (y.max - y.min);
        },
        right: function (_a, _b) {
            var x = _a.x;
            var left = _b.left;
            return parseFloat(left) + (x.max - x.min);
        },
        // Transform
        x: getTranslateFromMatrix(4, 13),
        y: getTranslateFromMatrix(5, 14),
    };
    var convertChangedValueTypes = function (target, visualElement, changedKeys) {
        var originBbox = visualElement.measureViewportBox();
        var element = visualElement.getInstance();
        var elementComputedStyle = getComputedStyle(element);
        var display = elementComputedStyle.display, top = elementComputedStyle.top, left = elementComputedStyle.left, bottom = elementComputedStyle.bottom, right = elementComputedStyle.right, transform = elementComputedStyle.transform;
        var originComputedStyle = { top: top, left: left, bottom: bottom, right: right, transform: transform };
        // If the element is currently set to display: "none", make it visible before
        // measuring the target bounding box
        if (display === "none") {
            visualElement.setStaticValue("display", target.display || "block");
        }
        // Apply the latest values (as set in checkAndConvertChangedValueTypes)
        visualElement.syncRender();
        var targetBbox = visualElement.measureViewportBox();
        changedKeys.forEach(function (key) {
            // Restore styles to their **calculated computed style**, not their actual
            // originally set style. This allows us to animate between equivalent pixel units.
            var value = visualElement.getValue(key);
            setAndResetVelocity(value, positionalValues[key](originBbox, originComputedStyle));
            target[key] = positionalValues[key](targetBbox, elementComputedStyle);
        });
        return target;
    };
    var checkAndConvertChangedValueTypes = function (visualElement, target, origin, transitionEnd) {
        if (origin === void 0) { origin = {}; }
        if (transitionEnd === void 0) { transitionEnd = {}; }
        target = __assign({}, target);
        transitionEnd = __assign({}, transitionEnd);
        var targetPositionalKeys = Object.keys(target).filter(isPositionalKey);
        // We want to remove any transform values that could affect the element's bounding box before
        // it's measured. We'll reapply these later.
        var removedTransformValues = [];
        var hasAttemptedToRemoveTransformValues = false;
        var changedValueTypeKeys = [];
        targetPositionalKeys.forEach(function (key) {
            var value = visualElement.getValue(key);
            if (!visualElement.hasValue(key))
                return;
            var from = origin[key];
            var to = target[key];
            var fromType = findDimensionValueType(from);
            var toType;
            // TODO: The current implementation of this basically throws an error
            // if you try and do value conversion via keyframes. There's probably
            // a way of doing this but the performance implications would need greater scrutiny,
            // as it'd be doing multiple resize-remeasure operations.
            if (isKeyframesTarget(to)) {
                var numKeyframes = to.length;
                for (var i = to[0] === null ? 1 : 0; i < numKeyframes; i++) {
                    if (!toType) {
                        toType = findDimensionValueType(to[i]);
                        //invariant(toType === fromType ||
                        //    (isNumOrPxType(fromType) && isNumOrPxType(toType)), "Keyframes must be of the same dimension as the current value");
                    }
                    //else {
                    ///    invariant(findDimensionValueType(to[i]) === toType, "All keyframes must be of the same type");
                    //}
                }
            }
            else {
                toType = findDimensionValueType(to);
            }
            if (fromType !== toType) {
                // If they're both just number or px, convert them both to numbers rather than
                // relying on resize/remeasure to convert (which is wasteful in this situation)
                if (isNumOrPxType(fromType) && isNumOrPxType(toType)) {
                    var current = value.get();
                    if (typeof current === "string") {
                        value.set(parseFloat(current));
                    }
                    if (typeof to === "string") {
                        target[key] = parseFloat(to);
                    }
                    else if (Array.isArray(to) && toType === px) {
                        target[key] = to.map(parseFloat);
                    }
                }
                else if ((fromType === null || fromType === void 0 ? void 0 : fromType.transform) &&
                    (toType === null || toType === void 0 ? void 0 : toType.transform) &&
                    (from === 0 || to === 0)) {
                    // If one or the other value is 0, it's safe to coerce it to the
                    // type of the other without measurement
                    if (from === 0) {
                        value.set(toType.transform(from));
                    }
                    else {
                        target[key] = fromType.transform(to);
                    }
                }
                else {
                    // If we're going to do value conversion via DOM measurements, we first
                    // need to remove non-positional transform values that could affect the bbox measurements.
                    if (!hasAttemptedToRemoveTransformValues) {
                        removedTransformValues = removeNonTranslationalTransform(visualElement);
                        hasAttemptedToRemoveTransformValues = true;
                    }
                    changedValueTypeKeys.push(key);
                    transitionEnd[key] =
                        transitionEnd[key] !== undefined
                            ? transitionEnd[key]
                            : target[key];
                    setAndResetVelocity(value, to);
                }
            }
        });
        if (changedValueTypeKeys.length) {
            var convertedTarget = convertChangedValueTypes(target, visualElement, changedValueTypeKeys);
            // If we removed transform values, reapply them before the next render
            if (removedTransformValues.length) {
                removedTransformValues.forEach(function (_a) {
                    var _b = __read(_a, 2), key = _b[0], value = _b[1];
                    visualElement.getValue(key).set(value);
                });
            }
            // Reapply original values
            visualElement.syncRender();
            return { target: convertedTarget, transitionEnd: transitionEnd };
        }
        else {
            return { target: target, transitionEnd: transitionEnd };
        }
    };
    /**
     * Convert value types for x/y/width/height/top/left/bottom/right
     *
     * Allows animation between `'auto'` -> `'100%'` or `0` -> `'calc(50% - 10vw)'`
     *
     * @internal
     */
    function unitConversion(visualElement, target, origin, transitionEnd) {
        return hasPositionalKey(target)
            ? checkAndConvertChangedValueTypes(visualElement, target, origin, transitionEnd)
            : { target: target, transitionEnd: transitionEnd };
    }

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    /**
     * Parse a DOM variant to make it animatable. This involves resolving CSS variables
     * and ensuring animations like "20%" => "calc(50vw)" are performed in pixels.
     */
    var parseDomVariant = function (visualElement, target, origin, transitionEnd) {
        var resolved = resolveCSSVariables(visualElement, target, transitionEnd);
        target = resolved.target;
        transitionEnd = resolved.transitionEnd;
        return unitConversion(visualElement, target, origin, transitionEnd);
    };

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    function scrapeMotionValuesFromProps$1(props) {
        var style = props.style;
        var newValues = {};
        for (var key in style) {
            if (isMotionValue(style[key]) || isForcedMotionValue(key, props)) {
                newValues[key] = style[key];
            }
        }
        return newValues;
    }

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */
    function renderHTML(element, _a) {
        var style = _a.style, vars = _a.vars;
        // Directly assign style into the Element's style prop. In tests Object.assign is the
        // fastest way to assign styles.
        Object.assign(element.style, style);
        // Loop over any CSS variables and assign those.
        for (var key in vars) {
            element.style.setProperty(key, vars[key]);
        }
    }

    /** 
    based on framer-motion@4.1.15,
    Copyright (c) 2018 Framer B.V.
    */

    function getComputedStyle$1(element) {
        return window.getComputedStyle(element);
    }
    var htmlConfig = {
        treeType: "dom",
        readValueFromInstance: function (domElement, key) {
            if (isTransformProp(key)) {
                var defaultType = getDefaultValueType(key);
                return defaultType ? defaultType.default || 0 : 0;
            }
            else {
                var computedStyle = getComputedStyle$1(domElement);
                return ((isCSSVariable$1(key)
                    ? computedStyle.getPropertyValue(key)
                    : computedStyle[key]) || 0);
            }
        },
        sortNodePosition: function (a, b) {
            /**
             * compareDocumentPosition returns a bitmask, by using the bitwise &
             * we're returning true if 2 in that bitmask is set to true. 2 is set
             * to true if b preceeds a.
             */
            return a.compareDocumentPosition(b) & 2 ? 1 : -1;
        },
        getBaseTarget: function (props, key) {
            var _a;
            return (_a = props.style) === null || _a === void 0 ? void 0 : _a[key];
        },
        measureViewportBox: function (element, _a) {
            var transformPagePoint = _a.transformPagePoint;
            return getBoundingBox(element, transformPagePoint);
        },
        /**
         * Reset the transform on the current Element. This is called as part
         * of a batched process across the entire layout tree. To remove this write
         * cycle it'd be interesting to see if it's possible to "undo" all the current
         * layout transforms up the tree in the same way this.getBoundingBoxWithoutTransforms
         * works
         */
        resetTransform: function (element, domElement, props) {
            var transformTemplate = props.transformTemplate;
            domElement.style.transform = transformTemplate
                ? transformTemplate({}, "")
                : "none";
            // Ensure that whatever happens next, we restore our transform on the next frame
            element.scheduleRender();
        },
        restoreTransform: function (instance, mutableState) {
            instance.style.transform = mutableState.style.transform;
        },
        removeValueFromRenderState: function (key, _a) {
            var vars = _a.vars, style = _a.style;
            delete vars[key];
            delete style[key];
        },
        /**
         * Ensure that HTML and Framer-specific value types like `px`->`%` and `Color`
         * can be animated by Motion.
         */
        makeTargetAnimatable: function (element, _a, _b, isMounted) {
            var transformValues = _b.transformValues;
            if (isMounted === void 0) { isMounted = true; }
            var transition = _a.transition, transitionEnd = _a.transitionEnd, target = __rest(_a, ["transition", "transitionEnd"]);
            var origin = getOrigin(target, transition || {}, element);
            /**
             * If Framer has provided a function to convert `Color` etc value types, convert them
             */
            if (transformValues) {
                if (transitionEnd)
                    transitionEnd = transformValues(transitionEnd);
                if (target)
                    target = transformValues(target);
                if (origin)
                    origin = transformValues(origin);
            }
            if (isMounted) {
                checkTargetForNewValues(element, target, origin);
                var parsed = parseDomVariant(element, target, origin, transitionEnd);
                transitionEnd = parsed.transitionEnd;
                target = parsed.target;
            }
            return __assign({ transition: transition,
                transitionEnd: transitionEnd }, target);
        },
        scrapeMotionValuesFromProps: scrapeMotionValuesFromProps$1,
        build: function (element, renderState, latestValues, projection, layoutState, options, props) {
            if (element.isVisible !== undefined) {
                renderState.style.visibility = element.isVisible
                    ? "visible"
                    : "hidden";
            }
            var isProjectionTranform = projection.isEnabled && layoutState.isHydrated;
            buildHTMLStyles(renderState, latestValues, projection, layoutState, options, props.transformTemplate, isProjectionTranform ? buildLayoutProjectionTransform : undefined, isProjectionTranform
                ? buildLayoutProjectionTransformOrigin
                : undefined);
        },
        render: renderHTML,
    };
    var htmlVisualElement = visualElement(htmlConfig);

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    function scrapeMotionValuesFromProps(props) {
        var newValues = scrapeMotionValuesFromProps$1(props);
        for (var key in props) {
            if (isMotionValue(props[key])) {
                var targetKey = key === "x" || key === "y" ? "attr" + key.toUpperCase() : key;
                newValues[targetKey] = props[key];
            }
        }
        return newValues;
    }

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */
    var CAMEL_CASE_PATTERN = /([a-z])([A-Z])/g;
    var REPLACE_TEMPLATE = "$1-$2";
    /**
     * Convert camelCase to dash-case properties.
     */
    var camelToDash = function (str) {
        return str.replace(CAMEL_CASE_PATTERN, REPLACE_TEMPLATE).toLowerCase();
    };

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */
    /**
     * A set of attribute names that are always read/written as camel case.
     */
    var camelCaseAttributes = new Set([
        "baseFrequency",
        "diffuseConstant",
        "kernelMatrix",
        "kernelUnitLength",
        "keySplines",
        "keyTimes",
        "limitingConeAngle",
        "markerHeight",
        "markerWidth",
        "numOctaves",
        "targetX",
        "targetY",
        "surfaceScale",
        "specularConstant",
        "specularExponent",
        "stdDeviation",
        "tableValues",
        "viewBox",
    ]);

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    function renderSVG(element, renderState) {
        renderHTML(element, renderState);
        for (var key in renderState.attrs) {
            element.setAttribute(!camelCaseAttributes.has(key) ? camelToDash(key) : key, renderState.attrs[key]);
        }
    }

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    var svgVisualElement = visualElement(__assign(__assign({}, htmlConfig), { getBaseTarget: function (props, key) {
            return props[key];
        },
        readValueFromInstance: function (domElement, key) {
            var _a;
            if (isTransformProp(key)) {
                return ((_a = getDefaultValueType(key)) === null || _a === void 0 ? void 0 : _a.default) || 0;
            }
            key = !camelCaseAttributes.has(key) ? camelToDash(key) : key;
            return domElement.getAttribute(key);
        },
        scrapeMotionValuesFromProps: scrapeMotionValuesFromProps,
        build: function (_element, renderState, latestValues, projection, layoutState, options, props) {
            var isProjectionTranform = projection.isEnabled && layoutState.isHydrated;
            buildSVGAttrs(renderState, latestValues, projection, layoutState, options, props.transformTemplate, isProjectionTranform ? buildLayoutProjectionTransform : undefined, isProjectionTranform
                ? buildLayoutProjectionTransformOrigin
                : undefined);
        }, render: renderSVG }));

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */


    var createDomVisualElement = function (Component, options) {
       
        return Component === "SVG"
            ? svgVisualElement(options, { enableHardwareAcceleration: false })
            : htmlVisualElement(options, { enableHardwareAcceleration: true });
    };

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    var svgMotionConfig = {
            scrapeMotionValuesFromProps: scrapeMotionValuesFromProps,
            createRenderState: createSvgRenderState,
            onMount: function (props, instance, _a) {
                var renderState = _a.renderState, latestValues = _a.latestValues;
                try {
                    renderState.dimensions =
                        typeof instance.getBBox ===
                            "function"
                            ? instance.getBBox()
                            : instance.getBoundingClientRect();
                }
                catch (e) {
                    // Most likely trying to measure an unrendered element under Firefox
                    renderState.dimensions = {
                        x: 0,
                        y: 0,
                        width: 0,
                        height: 0,
                    };
                }
                if (isPath(instance)) {
                    renderState.totalPathLength = instance.getTotalLength();
                }
                buildSVGAttrs(renderState, latestValues, undefined, undefined, { enableHardwareAcceleration: false }, props.transformTemplate);
                // TODO: Replace with direct assignment
                renderSVG(instance, renderState);
            },
        };
    function isPath(element) {
        return element.tagName === "path";
    }

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    var htmlMotionConfig = {
            scrapeMotionValuesFromProps: scrapeMotionValuesFromProps$1,
            createRenderState: createHtmlRenderState,   
    };

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    function getCurrentTreeVariants(props, context) {
        if (checkIfControllingVariants(props)) {
            var initial = props.initial, animate = props.animate;
            return {
                initial: initial === false || isVariantLabel(initial)
                    ? initial
                    : undefined,
                animate: isVariantLabel(animate) ? animate : undefined,
            };
        }
        return props.inherit !== false ? (context||{}) : {};
    }

    /* node_modules\svelte-motion\src\context\MotionContext\UseCreateMotionContext.svelte generated by Svelte v3.55.1 */
    const get_default_slot_changes$2 = dirty => ({ value: dirty & /*value*/ 1 });
    const get_default_slot_context$2 = ctx => ({ value: /*value*/ ctx[0] });

    function create_fragment$g(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], get_default_slot_context$2);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, value*/ 257)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, get_default_slot_changes$2),
    						get_default_slot_context$2
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let $mc;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UseCreateMotionContext', slots, ['default']);
    	let { props, isStatic, isCustom } = $$props;
    	let mc = getContext(MotionContext) || MotionContext(isCustom);
    	validate_store(mc, 'mc');
    	component_subscribe($$self, mc, value => $$invalidate(7, $mc = value));
    	let { initial, animate } = getCurrentTreeVariants(props, get_store_value(mc));

    	const variantLabelsAsDependency = prop => {
    		return Array.isArray(prop) ? prop.join(" ") : prop;
    	};

    	const memo = () => {
    		return { initial, animate };
    	};

    	/**
     * Only break memoisation in static mode
     */
    	let value = memo();

    	$$self.$$.on_mount.push(function () {
    		if (props === undefined && !('props' in $$props || $$self.$$.bound[$$self.$$.props['props']])) {
    			console.warn("<UseCreateMotionContext> was created without expected prop 'props'");
    		}

    		if (isStatic === undefined && !('isStatic' in $$props || $$self.$$.bound[$$self.$$.props['isStatic']])) {
    			console.warn("<UseCreateMotionContext> was created without expected prop 'isStatic'");
    		}

    		if (isCustom === undefined && !('isCustom' in $$props || $$self.$$.bound[$$self.$$.props['isCustom']])) {
    			console.warn("<UseCreateMotionContext> was created without expected prop 'isCustom'");
    		}
    	});

    	const writable_props = ['props', 'isStatic', 'isCustom'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UseCreateMotionContext> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('props' in $$props) $$invalidate(2, props = $$props.props);
    		if ('isStatic' in $$props) $$invalidate(3, isStatic = $$props.isStatic);
    		if ('isCustom' in $$props) $$invalidate(4, isCustom = $$props.isCustom);
    		if ('$$scope' in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		get: get_store_value,
    		MotionContext,
    		getCurrentTreeVariants,
    		props,
    		isStatic,
    		isCustom,
    		mc,
    		initial,
    		animate,
    		variantLabelsAsDependency,
    		memo,
    		value,
    		$mc
    	});

    	$$self.$inject_state = $$props => {
    		if ('props' in $$props) $$invalidate(2, props = $$props.props);
    		if ('isStatic' in $$props) $$invalidate(3, isStatic = $$props.isStatic);
    		if ('isCustom' in $$props) $$invalidate(4, isCustom = $$props.isCustom);
    		if ('mc' in $$props) $$invalidate(1, mc = $$props.mc);
    		if ('initial' in $$props) $$invalidate(5, initial = $$props.initial);
    		if ('animate' in $$props) $$invalidate(6, animate = $$props.animate);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*props, $mc*/ 132) {
    			$$invalidate(5, { initial, animate } = getCurrentTreeVariants(props, $mc), initial, (($$invalidate(6, animate), $$invalidate(2, props)), $$invalidate(7, $mc)));
    		}

    		if ($$self.$$.dirty & /*isStatic, initial, animate*/ 104) {
    			if (isStatic) {
    				$$invalidate(0, value = memo(variantLabelsAsDependency(initial), variantLabelsAsDependency(animate)));
    			}
    		}
    	};

    	return [value, mc, props, isStatic, isCustom, initial, animate, $mc, $$scope, slots];
    }

    class UseCreateMotionContext extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { props: 2, isStatic: 3, isCustom: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UseCreateMotionContext",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get props() {
    		throw new Error("<UseCreateMotionContext>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set props(value) {
    		throw new Error("<UseCreateMotionContext>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isStatic() {
    		throw new Error("<UseCreateMotionContext>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isStatic(value) {
    		throw new Error("<UseCreateMotionContext>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isCustom() {
    		throw new Error("<UseCreateMotionContext>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isCustom(value) {
    		throw new Error("<UseCreateMotionContext>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var UseCreateMotionContext$1 = UseCreateMotionContext;

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    /**
     * If the provided value is a MotionValue, this returns the actual value, otherwise just the value itself
     *
     * TODO: Remove and move to library
     *
     * @internal
     */
    function resolveMotionValue(value) {
        var unwrappedValue = isMotionValue(value) ? value.get() : value;
        return isCustomValue(unwrappedValue)
            ? unwrappedValue.toValue()
            : unwrappedValue;
    }

    /* node_modules\svelte-motion\src\motion\utils\UseVisualState.svelte generated by Svelte v3.55.1 */
    const get_default_slot_changes$1 = dirty => ({ state: dirty & /*state*/ 1 });
    const get_default_slot_context$1 = ctx => ({ state: /*state*/ ctx[0] });

    function create_fragment$f(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], get_default_slot_context$1);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, state*/ 513)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, get_default_slot_changes$1),
    						get_default_slot_context$1
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const makeState = ({ scrapeMotionValuesFromProps, createRenderState, onMount }, props, context, presenceContext) => {
    	const state = {
    		latestValues: makeLatestValues(props, context, presenceContext, scrapeMotionValuesFromProps),
    		renderState: createRenderState()
    	};

    	if (onMount) {
    		state.mount = instance => onMount(props, instance, state);
    	}

    	return state;
    };

    function makeLatestValues(props, context, presenceContext, scrapeMotionValues) {
    	const values = {};
    	const blockInitialAnimation = presenceContext?.initial === false;
    	const motionValues = scrapeMotionValues(props);

    	for (const key in motionValues) {
    		values[key] = resolveMotionValue(motionValues[key]);
    	}

    	let { initial, animate } = props;
    	const isControllingVariants = checkIfControllingVariants(props);
    	const isVariantNode = checkIfVariantNode(props);

    	if (context && isVariantNode && !isControllingVariants && props.inherit !== false) {
    		initial !== null && initial !== void 0
    		? initial
    		: initial = context.initial;

    		animate !== null && animate !== void 0
    		? animate
    		: animate = context.animate;
    	}

    	const variantToSet = blockInitialAnimation || initial === false
    	? animate
    	: initial;

    	if (variantToSet && typeof variantToSet !== "boolean" && !isAnimationControls(variantToSet)) {
    		const list = Array.isArray(variantToSet)
    		? variantToSet
    		: [variantToSet];

    		list.forEach(definition => {
    			const resolved = resolveVariantFromProps(props, definition);
    			if (!resolved) return;
    			const { transitionEnd, transition, ...target } = resolved;
    			for (const key in target) values[key] = target[key];
    			for (const key in transitionEnd) values[key] = transitionEnd[key];
    		});
    	}

    	return values;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let $presenceContext;
    	let $context;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UseVisualState', slots, ['default']);
    	let { config, props, isStatic, isCustom } = $$props;
    	const context = getContext(MotionContext) || MotionContext(isCustom);
    	validate_store(context, 'context');
    	component_subscribe($$self, context, value => $$invalidate(8, $context = value));
    	const presenceContext = getContext(PresenceContext) || PresenceContext(isCustom);
    	validate_store(presenceContext, 'presenceContext');
    	component_subscribe($$self, presenceContext, value => $$invalidate(7, $presenceContext = value));
    	let state = makeState(config, props, get_store_value(context), get_store_value(presenceContext));
    	const ms = makeState;

    	$$self.$$.on_mount.push(function () {
    		if (config === undefined && !('config' in $$props || $$self.$$.bound[$$self.$$.props['config']])) {
    			console.warn("<UseVisualState> was created without expected prop 'config'");
    		}

    		if (props === undefined && !('props' in $$props || $$self.$$.bound[$$self.$$.props['props']])) {
    			console.warn("<UseVisualState> was created without expected prop 'props'");
    		}

    		if (isStatic === undefined && !('isStatic' in $$props || $$self.$$.bound[$$self.$$.props['isStatic']])) {
    			console.warn("<UseVisualState> was created without expected prop 'isStatic'");
    		}

    		if (isCustom === undefined && !('isCustom' in $$props || $$self.$$.bound[$$self.$$.props['isCustom']])) {
    			console.warn("<UseVisualState> was created without expected prop 'isCustom'");
    		}
    	});

    	const writable_props = ['config', 'props', 'isStatic', 'isCustom'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UseVisualState> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('config' in $$props) $$invalidate(3, config = $$props.config);
    		if ('props' in $$props) $$invalidate(4, props = $$props.props);
    		if ('isStatic' in $$props) $$invalidate(5, isStatic = $$props.isStatic);
    		if ('isCustom' in $$props) $$invalidate(6, isCustom = $$props.isCustom);
    		if ('$$scope' in $$props) $$invalidate(9, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		resolveMotionValue,
    		checkIfControllingVariants,
    		checkIfVariantNode,
    		resolveVariantFromProps,
    		isAnimationControls,
    		makeState,
    		makeLatestValues,
    		getContext,
    		get: get_store_value,
    		PresenceContext,
    		MotionContext,
    		config,
    		props,
    		isStatic,
    		isCustom,
    		context,
    		presenceContext,
    		state,
    		ms,
    		$presenceContext,
    		$context
    	});

    	$$self.$inject_state = $$props => {
    		if ('config' in $$props) $$invalidate(3, config = $$props.config);
    		if ('props' in $$props) $$invalidate(4, props = $$props.props);
    		if ('isStatic' in $$props) $$invalidate(5, isStatic = $$props.isStatic);
    		if ('isCustom' in $$props) $$invalidate(6, isCustom = $$props.isCustom);
    		if ('state' in $$props) $$invalidate(0, state = $$props.state);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*isStatic, config, props, $context, $presenceContext*/ 440) {
    			if (isStatic) {
    				$$invalidate(0, state = ms(config, props, $context, $presenceContext));
    			}
    		}
    	};

    	return [
    		state,
    		context,
    		presenceContext,
    		config,
    		props,
    		isStatic,
    		isCustom,
    		$presenceContext,
    		$context,
    		$$scope,
    		slots
    	];
    }

    class UseVisualState extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {
    			config: 3,
    			props: 4,
    			isStatic: 5,
    			isCustom: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UseVisualState",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get config() {
    		throw new Error("<UseVisualState>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set config(value) {
    		throw new Error("<UseVisualState>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get props() {
    		throw new Error("<UseVisualState>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set props(value) {
    		throw new Error("<UseVisualState>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isStatic() {
    		throw new Error("<UseVisualState>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isStatic(value) {
    		throw new Error("<UseVisualState>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isCustom() {
    		throw new Error("<UseVisualState>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isCustom(value) {
    		throw new Error("<UseVisualState>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var UseVisualState$1 = UseVisualState;

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */
    function isRefObject(ref) {
        return (typeof ref === "object" &&
            Object.prototype.hasOwnProperty.call(ref, "current"));
    }

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    /**
     * Creates a ref function that, when called, hydrates the provided
     * external ref and VisualElement.
     */
    function useMotionRef(visualState, visualElement, externalRef) {
        return function (instance) {
            var _a;
            instance && ((_a = visualState.mount) === null || _a === void 0 ? void 0 : _a.call(visualState, instance));
            if (visualElement) {
                instance
                    ? visualElement.mount(instance)
                    : visualElement.unmount();
            }
            if (externalRef) {
                if (typeof externalRef === "function") {
                    externalRef(instance);
                }
                else if (isRefObject(externalRef)) {
                    externalRef.current = instance;
                }
            }
        }
    }

    /* node_modules\svelte-motion\src\motion\Motion.svelte generated by Svelte v3.55.1 */

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[21] = list[i];
    	return child_ctx;
    }

    const get_default_slot_changes = dirty => ({
    	motion: dirty & /*motion*/ 16777216,
    	props: dirty & /*renderProps*/ 33554432
    });

    const get_default_slot_context = ctx => ({
    	motion: /*motion*/ ctx[24],
    	props: /*renderProps*/ ctx[25]
    });

    // (193:24) <UseRender                             {Component}                             props={motionProps}                             ref={useMotionRef(visualState, context.visualElement, externalRef)}                             {visualState}                             {isStatic}                             {forwardMotionProps}                             let:motion                             let:props={renderProps}>
    function create_default_slot_6(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[14].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[15], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, motion, renderProps*/ 50364416)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[15],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[15])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[15], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(193:24) <UseRender                             {Component}                             props={motionProps}                             ref={useMotionRef(visualState, context.visualElement, externalRef)}                             {visualState}                             {isStatic}                             {forwardMotionProps}                             let:motion                             let:props={renderProps}>",
    		ctx
    	});

    	return block;
    }

    // (192:20) <MotionContextProvider value={context} {isCustom}>
    function create_default_slot_5(ctx) {
    	let userender;
    	let current;

    	userender = new UseRender$1({
    			props: {
    				Component: /*Component*/ ctx[6],
    				props: /*motionProps*/ ctx[4],
    				ref: useMotionRef(/*visualState*/ ctx[18], /*context*/ ctx[17].visualElement, /*externalRef*/ ctx[1]),
    				visualState: /*visualState*/ ctx[18],
    				isStatic: /*isStatic*/ ctx[3],
    				forwardMotionProps: /*forwardMotionProps*/ ctx[0],
    				$$slots: {
    					default: [
    						create_default_slot_6,
    						({ motion, props: renderProps }) => ({ 24: motion, 25: renderProps }),
    						({ motion, props: renderProps }) => (motion ? 16777216 : 0) | (renderProps ? 33554432 : 0)
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(userender.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(userender, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const userender_changes = {};
    			if (dirty & /*motionProps*/ 16) userender_changes.props = /*motionProps*/ ctx[4];
    			if (dirty & /*visualState, context, externalRef*/ 393218) userender_changes.ref = useMotionRef(/*visualState*/ ctx[18], /*context*/ ctx[17].visualElement, /*externalRef*/ ctx[1]);
    			if (dirty & /*visualState*/ 262144) userender_changes.visualState = /*visualState*/ ctx[18];
    			if (dirty & /*isStatic*/ 8) userender_changes.isStatic = /*isStatic*/ ctx[3];
    			if (dirty & /*forwardMotionProps*/ 1) userender_changes.forwardMotionProps = /*forwardMotionProps*/ ctx[0];

    			if (dirty & /*$$scope, motion, renderProps*/ 50364416) {
    				userender_changes.$$scope = { dirty, ctx };
    			}

    			userender.$set(userender_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(userender.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(userender.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(userender, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(192:20) <MotionContextProvider value={context} {isCustom}>",
    		ctx
    	});

    	return block;
    }

    // (206:20) {#if mounted}
    function create_if_block$1(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let each_value = /*_features*/ ctx[20];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*feat*/ ctx[21].key;
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*_features, isCustom*/ 1048608) {
    				each_value = /*_features*/ ctx[20];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block, each_1_anchor, get_each_context);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(206:20) {#if mounted}",
    		ctx
    	});

    	return block;
    }

    // (207:24) {#each _features as feat (feat.key)}
    function create_each_block(key_1, ctx) {
    	let first;
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*feat*/ ctx[21].Component;

    	function switch_props(ctx) {
    		return {
    			props: {
    				props: /*feat*/ ctx[21].props,
    				visualElement: /*feat*/ ctx[21].visualElement,
    				isCustom: /*isCustom*/ ctx[5]
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const switch_instance_changes = {};
    			if (dirty & /*_features*/ 1048576) switch_instance_changes.props = /*feat*/ ctx[21].props;
    			if (dirty & /*_features*/ 1048576) switch_instance_changes.visualElement = /*feat*/ ctx[21].visualElement;

    			if (switch_value !== (switch_value = /*feat*/ ctx[21].Component)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(207:24) {#each _features as feat (feat.key)}",
    		ctx
    	});

    	return block;
    }

    // (188:16) <UseFeatures                     visualElement={setContext(context, visualElement)}                     props={motionProps}                     let:features={_features}>
    function create_default_slot_4(ctx) {
    	let motioncontextprovider;
    	let t;
    	let if_block_anchor;
    	let current;

    	motioncontextprovider = new MotionContextProvider$1({
    			props: {
    				value: /*context*/ ctx[17],
    				isCustom: /*isCustom*/ ctx[5],
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block = /*mounted*/ ctx[2] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			create_component(motioncontextprovider.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(motioncontextprovider, target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const motioncontextprovider_changes = {};
    			if (dirty & /*context*/ 131072) motioncontextprovider_changes.value = /*context*/ ctx[17];

    			if (dirty & /*$$scope, motionProps, visualState, context, externalRef, isStatic, forwardMotionProps*/ 426011) {
    				motioncontextprovider_changes.$$scope = { dirty, ctx };
    			}

    			motioncontextprovider.$set(motioncontextprovider_changes);

    			if (/*mounted*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*mounted*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(motioncontextprovider.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(motioncontextprovider.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(motioncontextprovider, detaching);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(188:16) <UseFeatures                     visualElement={setContext(context, visualElement)}                     props={motionProps}                     let:features={_features}>",
    		ctx
    	});

    	return block;
    }

    // (181:12) <UseVisualElement                 {Component}                 {visualState}                 {createVisualElement}                 props={motionProps}                 {isCustom}                 let:visualElement>
    function create_default_slot_3(ctx) {
    	let usefeatures;
    	let current;

    	usefeatures = new UseFeatures$1({
    			props: {
    				visualElement: /*setContext*/ ctx[10](/*context*/ ctx[17], /*visualElement*/ ctx[19]),
    				props: /*motionProps*/ ctx[4],
    				$$slots: {
    					default: [
    						create_default_slot_4,
    						({ features: _features }) => ({ 20: _features }),
    						({ features: _features }) => _features ? 1048576 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(usefeatures.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(usefeatures, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const usefeatures_changes = {};
    			if (dirty & /*context, visualElement*/ 655360) usefeatures_changes.visualElement = /*setContext*/ ctx[10](/*context*/ ctx[17], /*visualElement*/ ctx[19]);
    			if (dirty & /*motionProps*/ 16) usefeatures_changes.props = /*motionProps*/ ctx[4];

    			if (dirty & /*$$scope, _features, mounted, context, motionProps, visualState, externalRef, isStatic, forwardMotionProps*/ 1474591) {
    				usefeatures_changes.$$scope = { dirty, ctx };
    			}

    			usefeatures.$set(usefeatures_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(usefeatures.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(usefeatures.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(usefeatures, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(181:12) <UseVisualElement                 {Component}                 {visualState}                 {createVisualElement}                 props={motionProps}                 {isCustom}                 let:visualElement>",
    		ctx
    	});

    	return block;
    }

    // (175:8) <UseVisualState             config={visualStateConfig}             props={motionProps}             {isStatic}             {isCustom}             let:state={visualState}>
    function create_default_slot_2(ctx) {
    	let usevisualelement;
    	let current;

    	usevisualelement = new UseVisualElement$1({
    			props: {
    				Component: /*Component*/ ctx[6],
    				visualState: /*visualState*/ ctx[18],
    				createVisualElement: /*createVisualElement*/ ctx[7],
    				props: /*motionProps*/ ctx[4],
    				isCustom: /*isCustom*/ ctx[5],
    				$$slots: {
    					default: [
    						create_default_slot_3,
    						({ visualElement }) => ({ 19: visualElement }),
    						({ visualElement }) => visualElement ? 524288 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(usevisualelement.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(usevisualelement, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const usevisualelement_changes = {};
    			if (dirty & /*visualState*/ 262144) usevisualelement_changes.visualState = /*visualState*/ ctx[18];
    			if (dirty & /*motionProps*/ 16) usevisualelement_changes.props = /*motionProps*/ ctx[4];

    			if (dirty & /*$$scope, context, visualElement, motionProps, mounted, visualState, externalRef, isStatic, forwardMotionProps*/ 950303) {
    				usevisualelement_changes.$$scope = { dirty, ctx };
    			}

    			usevisualelement.$set(usevisualelement_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(usevisualelement.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(usevisualelement.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(usevisualelement, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(175:8) <UseVisualState             config={visualStateConfig}             props={motionProps}             {isStatic}             {isCustom}             let:state={visualState}>",
    		ctx
    	});

    	return block;
    }

    // (174:4) <UseCreateMotionContext props={motionProps} {isStatic} let:value={context} {isCustom}>
    function create_default_slot_1$1(ctx) {
    	let usevisualstate;
    	let current;

    	usevisualstate = new UseVisualState$1({
    			props: {
    				config: /*visualStateConfig*/ ctx[8],
    				props: /*motionProps*/ ctx[4],
    				isStatic: /*isStatic*/ ctx[3],
    				isCustom: /*isCustom*/ ctx[5],
    				$$slots: {
    					default: [
    						create_default_slot_2,
    						({ state: visualState }) => ({ 18: visualState }),
    						({ state: visualState }) => visualState ? 262144 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(usevisualstate.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(usevisualstate, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const usevisualstate_changes = {};
    			if (dirty & /*motionProps*/ 16) usevisualstate_changes.props = /*motionProps*/ ctx[4];
    			if (dirty & /*isStatic*/ 8) usevisualstate_changes.isStatic = /*isStatic*/ ctx[3];

    			if (dirty & /*$$scope, visualState, motionProps, context, mounted, externalRef, isStatic, forwardMotionProps*/ 426015) {
    				usevisualstate_changes.$$scope = { dirty, ctx };
    			}

    			usevisualstate.$set(usevisualstate_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(usevisualstate.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(usevisualstate.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(usevisualstate, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(174:4) <UseCreateMotionContext props={motionProps} {isStatic} let:value={context} {isCustom}>",
    		ctx
    	});

    	return block;
    }

    // (173:0) <ScaleCorrectionProvider {isCustom}>
    function create_default_slot$4(ctx) {
    	let usecreatemotioncontext;
    	let current;

    	usecreatemotioncontext = new UseCreateMotionContext$1({
    			props: {
    				props: /*motionProps*/ ctx[4],
    				isStatic: /*isStatic*/ ctx[3],
    				isCustom: /*isCustom*/ ctx[5],
    				$$slots: {
    					default: [
    						create_default_slot_1$1,
    						({ value: context }) => ({ 17: context }),
    						({ value: context }) => context ? 131072 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(usecreatemotioncontext.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(usecreatemotioncontext, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const usecreatemotioncontext_changes = {};
    			if (dirty & /*motionProps*/ 16) usecreatemotioncontext_changes.props = /*motionProps*/ ctx[4];
    			if (dirty & /*isStatic*/ 8) usecreatemotioncontext_changes.isStatic = /*isStatic*/ ctx[3];

    			if (dirty & /*$$scope, motionProps, isStatic, context, mounted, externalRef, forwardMotionProps*/ 163871) {
    				usecreatemotioncontext_changes.$$scope = { dirty, ctx };
    			}

    			usecreatemotioncontext.$set(usecreatemotioncontext_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(usecreatemotioncontext.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(usecreatemotioncontext.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(usecreatemotioncontext, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(173:0) <ScaleCorrectionProvider {isCustom}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let scalecorrectionprovider;
    	let current;

    	scalecorrectionprovider = new ScaleCorrectionProvider$1({
    			props: {
    				isCustom: /*isCustom*/ ctx[5],
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(scalecorrectionprovider.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(scalecorrectionprovider, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const scalecorrectionprovider_changes = {};

    			if (dirty & /*$$scope, motionProps, isStatic, mounted, externalRef, forwardMotionProps*/ 32799) {
    				scalecorrectionprovider_changes.$$scope = { dirty, ctx };
    			}

    			scalecorrectionprovider.$set(scalecorrectionprovider_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scalecorrectionprovider.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scalecorrectionprovider.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(scalecorrectionprovider, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let motionProps;
    	let isStatic;
    	const omit_props_names = ["isSVG","forwardMotionProps","externalRef","targetEl"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $a;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Motion', slots, ['default']);
    	let { isSVG = false, forwardMotionProps = false, externalRef = undefined, targetEl = undefined } = $$props;
    	const isCustom = targetEl;
    	let Component = isSVG ? "SVG" : "DOM";
    	let createVisualElement = createDomVisualElement;
    	let visualStateConfig = isSVG ? svgMotionConfig : htmlMotionConfig;

    	/**
     * If a component is static, we only visually update it as a
     * result of a React re-render, rather than any interactions or animations.
     * If this component or any ancestor is static, we disable hardware acceleration
     * and don't load any additional functionality.
     */
    	const a = getContext(MotionConfigContext) || MotionConfigContext(isCustom);

    	validate_store(a, 'a');
    	component_subscribe($$self, a, value => $$invalidate(13, $a = value));
    	let mounted = false;

    	const setContext = (c, v) => {
    		c.visualElement = v;
    		return v;
    	};

    	onMount(() => $$invalidate(2, mounted = true));

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(16, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('isSVG' in $$new_props) $$invalidate(11, isSVG = $$new_props.isSVG);
    		if ('forwardMotionProps' in $$new_props) $$invalidate(0, forwardMotionProps = $$new_props.forwardMotionProps);
    		if ('externalRef' in $$new_props) $$invalidate(1, externalRef = $$new_props.externalRef);
    		if ('targetEl' in $$new_props) $$invalidate(12, targetEl = $$new_props.targetEl);
    		if ('$$scope' in $$new_props) $$invalidate(15, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		MotionConfigContext,
    		UseVisualElement: UseVisualElement$1,
    		UseFeatures: UseFeatures$1,
    		MotionContextProvider: MotionContextProvider$1,
    		getContext,
    		onMount,
    		UseRender: UseRender$1,
    		createDomVisualElement,
    		svgMotionConfig,
    		htmlMotionConfig,
    		UseCreateMotionContext: UseCreateMotionContext$1,
    		UseVisualState: UseVisualState$1,
    		useMotionRef,
    		ScaleCorrectionProvider: ScaleCorrectionProvider$1,
    		isSVG,
    		forwardMotionProps,
    		externalRef,
    		targetEl,
    		isCustom,
    		Component,
    		createVisualElement,
    		visualStateConfig,
    		a,
    		mounted,
    		setContext,
    		isStatic,
    		motionProps,
    		$a
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('isSVG' in $$props) $$invalidate(11, isSVG = $$new_props.isSVG);
    		if ('forwardMotionProps' in $$props) $$invalidate(0, forwardMotionProps = $$new_props.forwardMotionProps);
    		if ('externalRef' in $$props) $$invalidate(1, externalRef = $$new_props.externalRef);
    		if ('targetEl' in $$props) $$invalidate(12, targetEl = $$new_props.targetEl);
    		if ('Component' in $$props) $$invalidate(6, Component = $$new_props.Component);
    		if ('createVisualElement' in $$props) $$invalidate(7, createVisualElement = $$new_props.createVisualElement);
    		if ('visualStateConfig' in $$props) $$invalidate(8, visualStateConfig = $$new_props.visualStateConfig);
    		if ('mounted' in $$props) $$invalidate(2, mounted = $$new_props.mounted);
    		if ('isStatic' in $$props) $$invalidate(3, isStatic = $$new_props.isStatic);
    		if ('motionProps' in $$props) $$invalidate(4, motionProps = $$new_props.motionProps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(4, motionProps = $$restProps); /*{
        initial,
        style,
        transformTemplate,
        transformValues,
        //AnimationProps
        animate,
        exit,
        variants,
        transition,
        //VisualElementLifecycles
        onViewportBoxUpdate,
        onBeforeLayoutMeasure,
        onLayoutMeasure,
        onUpdate,
        onAnimationStart,
        onAnimationComplete,
        onLayoutAnimationComplete,
        //GestureHandlers
        // PanHandlers
        onPan,
        onPanStart,
        onPanSessionStart,
        onPanEnd,
        // TapHandlers
        onTap,
        onTapStart,
        onTapCancel,
        whileTap,
        //HoverHandlers
        whileHover,
        onHoverStart,
        onHoverEnd,
        //FocusHandlers
        whileFocus,
        //DraggableProps
        drag,
        whileDrag,
        dragDirectionLock,
        dragPropagation,
        dragConstraints,
        dragElastic,
        dragMomentum,
        dragTransition,
        dragControls,
        dragListener,
        onMeasureDragConstraints,
        _dragX,
        _dragY,
        //DragHandlers
        onDragStart,
        onDragEnd,
        onDrag,
        onDirectionLock,
        onDragTransitionEnd,
        // LayoutProps
        layout,
        layoutId,
        //MotionAdvancedProps
        custom,
        inherit,
        ...(isSVG ? $$restProps : {}),
    };*/

    		if ($$self.$$.dirty & /*$a*/ 8192) {
    			$$invalidate(3, { isStatic } = $a || {}, isStatic);
    		}
    	};

    	return [
    		forwardMotionProps,
    		externalRef,
    		mounted,
    		isStatic,
    		motionProps,
    		isCustom,
    		Component,
    		createVisualElement,
    		visualStateConfig,
    		a,
    		setContext,
    		isSVG,
    		targetEl,
    		$a,
    		slots,
    		$$scope
    	];
    }

    class Motion extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {
    			isSVG: 11,
    			forwardMotionProps: 0,
    			externalRef: 1,
    			targetEl: 12
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Motion",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get isSVG() {
    		throw new Error("<Motion>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isSVG(value) {
    		throw new Error("<Motion>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get forwardMotionProps() {
    		throw new Error("<Motion>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set forwardMotionProps(value) {
    		throw new Error("<Motion>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get externalRef() {
    		throw new Error("<Motion>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set externalRef(value) {
    		throw new Error("<Motion>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get targetEl() {
    		throw new Error("<Motion>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set targetEl(value) {
    		throw new Error("<Motion>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Motion$1 = Motion;

    /* node_modules\svelte-motion\src\events\UseDomEvent.svelte generated by Svelte v3.55.1 */

    function create_fragment$d(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function addDomEvent(target, eventName, handler, options) {
    	target.addEventListener(eventName, handler, options);

    	return function () {
    		return target.removeEventListener(eventName, handler, options);
    	};
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UseDomEvent', slots, ['default']);
    	let { ref, eventName, handler = undefined, options = undefined } = $$props;

    	let cleanup = () => {
    		
    	};

    	const effect = () => {
    		cleanup();

    		if (!ref) {
    			return () => {
    				
    			};
    		}

    		const element = ref.current;

    		if (handler && element) {
    			return addDomEvent(element, eventName, handler, options);
    		}

    		return () => {
    			
    		};
    	};

    	onDestroy(cleanup);

    	$$self.$$.on_mount.push(function () {
    		if (ref === undefined && !('ref' in $$props || $$self.$$.bound[$$self.$$.props['ref']])) {
    			console.warn("<UseDomEvent> was created without expected prop 'ref'");
    		}

    		if (eventName === undefined && !('eventName' in $$props || $$self.$$.bound[$$self.$$.props['eventName']])) {
    			console.warn("<UseDomEvent> was created without expected prop 'eventName'");
    		}
    	});

    	const writable_props = ['ref', 'eventName', 'handler', 'options'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UseDomEvent> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('ref' in $$props) $$invalidate(0, ref = $$props.ref);
    		if ('eventName' in $$props) $$invalidate(1, eventName = $$props.eventName);
    		if ('handler' in $$props) $$invalidate(2, handler = $$props.handler);
    		if ('options' in $$props) $$invalidate(3, options = $$props.options);
    		if ('$$scope' in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		addDomEvent,
    		onDestroy,
    		ref,
    		eventName,
    		handler,
    		options,
    		cleanup,
    		effect
    	});

    	$$self.$inject_state = $$props => {
    		if ('ref' in $$props) $$invalidate(0, ref = $$props.ref);
    		if ('eventName' in $$props) $$invalidate(1, eventName = $$props.eventName);
    		if ('handler' in $$props) $$invalidate(2, handler = $$props.handler);
    		if ('options' in $$props) $$invalidate(3, options = $$props.options);
    		if ('cleanup' in $$props) cleanup = $$props.cleanup;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*ref, eventName, handler, options*/ 15) {
    			cleanup = effect();
    		}
    	};

    	return [ref, eventName, handler, options, $$scope, slots];
    }

    class UseDomEvent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {
    			ref: 0,
    			eventName: 1,
    			handler: 2,
    			options: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UseDomEvent",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get ref() {
    		throw new Error("<UseDomEvent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<UseDomEvent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get eventName() {
    		throw new Error("<UseDomEvent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set eventName(value) {
    		throw new Error("<UseDomEvent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get handler() {
    		throw new Error("<UseDomEvent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set handler(value) {
    		throw new Error("<UseDomEvent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get options() {
    		throw new Error("<UseDomEvent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<UseDomEvent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var UseDomEvent$1 = UseDomEvent;

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    function isMouseEvent(event) {
        // PointerEvent inherits from MouseEvent so we can't use a straight instanceof check.
        if (typeof PointerEvent !== "undefined" && event instanceof PointerEvent) {
            return !!(event.pointerType === "mouse");
        }
        return event instanceof MouseEvent;
    }
    function isTouchEvent(event) {
        var hasTouches = !!event.touches;
        return hasTouches;
    }

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    /**
     * Filters out events not attached to the primary pointer (currently left mouse button)
     * @param eventHandler
     */
    function filterPrimaryPointer(eventHandler) {
        return function (event) {
            var isMouseEvent = event instanceof MouseEvent;
            var isPrimaryPointer = !isMouseEvent ||
                (isMouseEvent && event.button === 0);
            if (isPrimaryPointer) {
                eventHandler(event);
            }
        };
    }
    var defaultPagePoint = { pageX: 0, pageY: 0 };
    function pointFromTouch(e, pointType) {
        if (pointType === void 0) { pointType = "page"; }
        var primaryTouch = e.touches[0] || e.changedTouches[0];
        var point = primaryTouch || defaultPagePoint;
        return {
            x: point[pointType + "X"],
            y: point[pointType + "Y"],
        };
    }
    function pointFromMouse(point, pointType) {
        if (pointType === void 0) { pointType = "page"; }
        return {
            x: point[pointType + "X"],
            y: point[pointType + "Y"],
        };
    }
    function extractEventInfo(event, pointType) {
        if (pointType === void 0) { pointType = "page"; }
        return {
            point: isTouchEvent(event)
                ? pointFromTouch(event, pointType)
                : pointFromMouse(event, pointType),
        };
    }
    function getViewportPointFromEvent(event) {
        return extractEventInfo(event, "client");
    }
    var wrapHandler = function (handler, shouldFilterPrimaryPointer) {
        if (shouldFilterPrimaryPointer === void 0) { shouldFilterPrimaryPointer = false; }
        var listener = function (event) {
            return handler(event, extractEventInfo(event));
        };
        return shouldFilterPrimaryPointer
            ? filterPrimaryPointer(listener)
            : listener;
    };

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */
    var isBrowser = typeof window !== "undefined";

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    // We check for event support via functions in case they've been mocked by a testing suite.
    var supportsPointerEvents = function () {
        return isBrowser && window.onpointerdown === null;
    };
    var supportsTouchEvents = function () {
        return isBrowser && window.ontouchstart === null;
    };
    var supportsMouseEvents = function () {
        return isBrowser && window.onmousedown === null;
    };

    /* node_modules\svelte-motion\src\events\UsePointerEvent.svelte generated by Svelte v3.55.1 */

    // (65:0) <UseDomEvent {ref}   eventName={getPointerEventName(eventName)} handler={handler && wrapHandler(handler, eventName === "pointerdown")} {options}>
    function create_default_slot$3(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(65:0) <UseDomEvent {ref}   eventName={getPointerEventName(eventName)} handler={handler && wrapHandler(handler, eventName === \\\"pointerdown\\\")} {options}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let usedomevent;
    	let current;

    	usedomevent = new UseDomEvent$1({
    			props: {
    				ref: /*ref*/ ctx[0],
    				eventName: getPointerEventName(/*eventName*/ ctx[1]),
    				handler: /*handler*/ ctx[2] && wrapHandler(/*handler*/ ctx[2], /*eventName*/ ctx[1] === "pointerdown"),
    				options: /*options*/ ctx[3],
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(usedomevent.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(usedomevent, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const usedomevent_changes = {};
    			if (dirty & /*ref*/ 1) usedomevent_changes.ref = /*ref*/ ctx[0];
    			if (dirty & /*eventName*/ 2) usedomevent_changes.eventName = getPointerEventName(/*eventName*/ ctx[1]);
    			if (dirty & /*handler, eventName*/ 6) usedomevent_changes.handler = /*handler*/ ctx[2] && wrapHandler(/*handler*/ ctx[2], /*eventName*/ ctx[1] === "pointerdown");
    			if (dirty & /*options*/ 8) usedomevent_changes.options = /*options*/ ctx[3];

    			if (dirty & /*$$scope*/ 32) {
    				usedomevent_changes.$$scope = { dirty, ctx };
    			}

    			usedomevent.$set(usedomevent_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(usedomevent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(usedomevent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(usedomevent, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const mouseEventNames = {
    	pointerdown: "mousedown",
    	pointermove: "mousemove",
    	pointerup: "mouseup",
    	pointercancel: "mousecancel",
    	pointerover: "mouseover",
    	pointerout: "mouseout",
    	pointerenter: "mouseenter",
    	pointerleave: "mouseleave"
    };

    const touchEventNames = {
    	pointerdown: "touchstart",
    	pointermove: "touchmove",
    	pointerup: "touchend",
    	pointercancel: "touchcancel"
    };

    function getPointerEventName(name) {
    	if (supportsPointerEvents()) {
    		return name;
    	} else if (supportsTouchEvents()) {
    		return touchEventNames[name];
    	} else if (supportsMouseEvents()) {
    		return mouseEventNames[name];
    	}

    	return name;
    }

    function addPointerEvent(target, eventName, handler, options) {
    	return addDomEvent(target, getPointerEventName(eventName), wrapHandler(handler, eventName === "pointerdown"), options);
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UsePointerEvent', slots, ['default']);
    	let { ref, eventName, handler = undefined, options = undefined } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (ref === undefined && !('ref' in $$props || $$self.$$.bound[$$self.$$.props['ref']])) {
    			console.warn("<UsePointerEvent> was created without expected prop 'ref'");
    		}

    		if (eventName === undefined && !('eventName' in $$props || $$self.$$.bound[$$self.$$.props['eventName']])) {
    			console.warn("<UsePointerEvent> was created without expected prop 'eventName'");
    		}
    	});

    	const writable_props = ['ref', 'eventName', 'handler', 'options'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UsePointerEvent> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('ref' in $$props) $$invalidate(0, ref = $$props.ref);
    		if ('eventName' in $$props) $$invalidate(1, eventName = $$props.eventName);
    		if ('handler' in $$props) $$invalidate(2, handler = $$props.handler);
    		if ('options' in $$props) $$invalidate(3, options = $$props.options);
    		if ('$$scope' in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		UseDomEvent: UseDomEvent$1,
    		supportsPointerEvents,
    		supportsTouchEvents,
    		supportsMouseEvents,
    		mouseEventNames,
    		touchEventNames,
    		getPointerEventName,
    		addPointerEvent,
    		wrapHandler,
    		addDomEvent,
    		ref,
    		eventName,
    		handler,
    		options
    	});

    	$$self.$inject_state = $$props => {
    		if ('ref' in $$props) $$invalidate(0, ref = $$props.ref);
    		if ('eventName' in $$props) $$invalidate(1, eventName = $$props.eventName);
    		if ('handler' in $$props) $$invalidate(2, handler = $$props.handler);
    		if ('options' in $$props) $$invalidate(3, options = $$props.options);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [ref, eventName, handler, options, slots, $$scope];
    }

    class UsePointerEvent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {
    			ref: 0,
    			eventName: 1,
    			handler: 2,
    			options: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UsePointerEvent",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get ref() {
    		throw new Error("<UsePointerEvent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<UsePointerEvent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get eventName() {
    		throw new Error("<UsePointerEvent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set eventName(value) {
    		throw new Error("<UsePointerEvent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get handler() {
    		throw new Error("<UsePointerEvent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set handler(value) {
    		throw new Error("<UsePointerEvent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get options() {
    		throw new Error("<UsePointerEvent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<UsePointerEvent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var UsePointerEvent$1 = UsePointerEvent;

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    /**
     * @internal
     */
    var PanSession = /** @class */ (function () {
        function PanSession(event, handlers, _a) {
            var _this = this;
            var _b = _a === void 0 ? {} : _a, transformPagePoint = _b.transformPagePoint;
            /**
             * @internal
             */
            this.startEvent = null;
            /**
             * @internal
             */
            this.lastMoveEvent = null;
            /**
             * @internal
             */
            this.lastMoveEventInfo = null;
            /**
             * @internal
             */
            this.handlers = {};
            this.updatePoint = function () {
                if (!(_this.lastMoveEvent && _this.lastMoveEventInfo))
                    return;
                var info = getPanInfo(_this.lastMoveEventInfo, _this.history);
                var isPanStarted = _this.startEvent !== null;
                // Only start panning if the offset is larger than 3 pixels. If we make it
                // any larger than this we'll want to reset the pointer history
                // on the first update to avoid visual snapping to the cursoe.
                var isDistancePastThreshold = distance(info.offset, { x: 0, y: 0 }) >= 3;
                if (!isPanStarted && !isDistancePastThreshold)
                    return;
                var point = info.point;
                var timestamp = getFrameData().timestamp;
                _this.history.push(__assign(__assign({}, point), { timestamp: timestamp }));
                var _a = _this.handlers, onStart = _a.onStart, onMove = _a.onMove;
                if (!isPanStarted) {
                    onStart && onStart(_this.lastMoveEvent, info);
                    _this.startEvent = _this.lastMoveEvent;
                }
                onMove && onMove(_this.lastMoveEvent, info);
            };
            this.handlePointerMove = function (event, info) {
                _this.lastMoveEvent = event;
                _this.lastMoveEventInfo = transformPoint(info, _this.transformPagePoint);
                // Because Safari doesn't trigger mouseup events when it's above a `<select>`
                if (isMouseEvent(event) && event.buttons === 0) {
                    _this.handlePointerUp(event, info);
                    return;
                }
                // Throttle mouse move event to once per frame
                sync.update(_this.updatePoint, true);
            };
            this.handlePointerUp = function (event, info) {
                _this.end();
                var _a = _this.handlers, onEnd = _a.onEnd, onSessionEnd = _a.onSessionEnd;
                var panInfo = getPanInfo(transformPoint(info, _this.transformPagePoint), _this.history);
                if (_this.startEvent && onEnd) {
                    onEnd(event, panInfo);
                }
                onSessionEnd && onSessionEnd(event, panInfo);
            };
            // If we have more than one touch, don't start detecting this gesture
            if (isTouchEvent(event) && event.touches.length > 1)
                return;
            this.handlers = handlers;
            this.transformPagePoint = transformPagePoint;
            var info = extractEventInfo(event);
            var initialInfo = transformPoint(info, this.transformPagePoint);
            var point = initialInfo.point;
            var timestamp = getFrameData().timestamp;
            this.history = [__assign(__assign({}, point), { timestamp: timestamp })];
            var onSessionStart = handlers.onSessionStart;
            onSessionStart &&
                onSessionStart(event, getPanInfo(initialInfo, this.history));
            this.removeListeners = pipe(addPointerEvent(window, "pointermove", this.handlePointerMove), addPointerEvent(window, "pointerup", this.handlePointerUp), addPointerEvent(window, "pointercancel", this.handlePointerUp));
        }
        PanSession.prototype.updateHandlers = function (handlers) {
            this.handlers = handlers;
        };
        PanSession.prototype.end = function () {
            this.removeListeners && this.removeListeners();
            cancelSync.update(this.updatePoint);
        };
        return PanSession;
    }());
    function transformPoint(info, transformPagePoint) {
        return transformPagePoint ? { point: transformPagePoint(info.point) } : info;
    }
    function subtractPoint(a, b) {
        return { x: a.x - b.x, y: a.y - b.y };
    }
    function getPanInfo(_a, history) {
        var point = _a.point;
        return {
            point: point,
            delta: subtractPoint(point, lastDevicePoint(history)),
            offset: subtractPoint(point, startDevicePoint(history)),
            velocity: getVelocity(history, 0.1),
        };
    }
    function startDevicePoint(history) {
        return history[0];
    }
    function lastDevicePoint(history) {
        return history[history.length - 1];
    }
    function getVelocity(history, timeDelta) {
        if (history.length < 2) {
            return { x: 0, y: 0 };
        }
        var i = history.length - 1;
        var timestampedPoint = null;
        var lastPoint = lastDevicePoint(history);
        while (i >= 0) {
            timestampedPoint = history[i];
            if (lastPoint.timestamp - timestampedPoint.timestamp >
                secondsToMilliseconds(timeDelta)) {
                break;
            }
            i--;
        }
        if (!timestampedPoint) {
            return { x: 0, y: 0 };
        }
        var time = (lastPoint.timestamp - timestampedPoint.timestamp) / 1000;
        if (time === 0) {
            return { x: 0, y: 0 };
        }
        var currentVelocity = {
            x: (lastPoint.x - timestampedPoint.x) / time,
            y: (lastPoint.y - timestampedPoint.y) / time,
        };
        if (currentVelocity.x === Infinity) {
            currentVelocity.x = 0;
        }
        if (currentVelocity.y === Infinity) {
            currentVelocity.y = 0;
        }
        return currentVelocity;
    }

    /* node_modules\svelte-motion\src\gestures\UsePanGesture.svelte generated by Svelte v3.55.1 */

    // (61:0) <UsePointerEvent ref={visualElement} eventName="pointerdown" handler={hasPanEvents && onPointerDown}>
    function create_default_slot$2(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(61:0) <UsePointerEvent ref={visualElement} eventName=\\\"pointerdown\\\" handler={hasPanEvents && onPointerDown}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let usepointerevent;
    	let current;

    	usepointerevent = new UsePointerEvent$1({
    			props: {
    				ref: /*visualElement*/ ctx[0],
    				eventName: "pointerdown",
    				handler: /*hasPanEvents*/ ctx[1] && /*onPointerDown*/ ctx[3],
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(usepointerevent.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(usepointerevent, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const usepointerevent_changes = {};
    			if (dirty & /*visualElement*/ 1) usepointerevent_changes.ref = /*visualElement*/ ctx[0];
    			if (dirty & /*hasPanEvents*/ 2) usepointerevent_changes.handler = /*hasPanEvents*/ ctx[1] && /*onPointerDown*/ ctx[3];

    			if (dirty & /*$$scope*/ 4096) {
    				usepointerevent_changes.$$scope = { dirty, ctx };
    			}

    			usepointerevent.$set(usepointerevent_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(usepointerevent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(usepointerevent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(usepointerevent, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let hasPanEvents;
    	let $mcc;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UsePanGesture', slots, ['default']);
    	let { props, visualElement, isCustom } = $$props;
    	let { onPan, onPanStart, onPanEnd, onPanSessionStart } = props;
    	let panSession = null;
    	const mcc = getContext(MotionConfigContext) || MotionConfigContext(isCustom);
    	validate_store(mcc, 'mcc');
    	component_subscribe($$self, mcc, value => $$invalidate(10, $mcc = value));
    	let { transformPagePoint } = get_store_value(mcc);

    	let handlers = {
    		onSessionStart: onPanSessionStart,
    		onStart: onPanStart,
    		onMove: onPan,
    		onEnd: (event, info) => {
    			panSession = null;
    			onPanEnd && onPanEnd(event, info);
    		}
    	};

    	function onPointerDown(event) {
    		panSession = new PanSession(event, handlers, { transformPagePoint });
    	}

    	afterUpdate(() => {
    		if (panSession !== null) {
    			panSession.updateHandlers(handlers);
    		}
    	});

    	onDestroy(() => panSession && panSession.end());

    	$$self.$$.on_mount.push(function () {
    		if (props === undefined && !('props' in $$props || $$self.$$.bound[$$self.$$.props['props']])) {
    			console.warn("<UsePanGesture> was created without expected prop 'props'");
    		}

    		if (visualElement === undefined && !('visualElement' in $$props || $$self.$$.bound[$$self.$$.props['visualElement']])) {
    			console.warn("<UsePanGesture> was created without expected prop 'visualElement'");
    		}

    		if (isCustom === undefined && !('isCustom' in $$props || $$self.$$.bound[$$self.$$.props['isCustom']])) {
    			console.warn("<UsePanGesture> was created without expected prop 'isCustom'");
    		}
    	});

    	const writable_props = ['props', 'visualElement', 'isCustom'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UsePanGesture> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('props' in $$props) $$invalidate(4, props = $$props.props);
    		if ('visualElement' in $$props) $$invalidate(0, visualElement = $$props.visualElement);
    		if ('isCustom' in $$props) $$invalidate(5, isCustom = $$props.isCustom);
    		if ('$$scope' in $$props) $$invalidate(12, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		MotionConfigContext,
    		PanSession,
    		afterUpdate,
    		getContext,
    		onDestroy,
    		UsePointerEvent: UsePointerEvent$1,
    		get: get_store_value,
    		props,
    		visualElement,
    		isCustom,
    		onPan,
    		onPanStart,
    		onPanEnd,
    		onPanSessionStart,
    		panSession,
    		mcc,
    		transformPagePoint,
    		handlers,
    		onPointerDown,
    		hasPanEvents,
    		$mcc
    	});

    	$$self.$inject_state = $$props => {
    		if ('props' in $$props) $$invalidate(4, props = $$props.props);
    		if ('visualElement' in $$props) $$invalidate(0, visualElement = $$props.visualElement);
    		if ('isCustom' in $$props) $$invalidate(5, isCustom = $$props.isCustom);
    		if ('onPan' in $$props) $$invalidate(6, onPan = $$props.onPan);
    		if ('onPanStart' in $$props) $$invalidate(7, onPanStart = $$props.onPanStart);
    		if ('onPanEnd' in $$props) $$invalidate(8, onPanEnd = $$props.onPanEnd);
    		if ('onPanSessionStart' in $$props) $$invalidate(9, onPanSessionStart = $$props.onPanSessionStart);
    		if ('panSession' in $$props) panSession = $$props.panSession;
    		if ('transformPagePoint' in $$props) transformPagePoint = $$props.transformPagePoint;
    		if ('handlers' in $$props) handlers = $$props.handlers;
    		if ('hasPanEvents' in $$props) $$invalidate(1, hasPanEvents = $$props.hasPanEvents);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*props*/ 16) {
    			$$invalidate(6, { onPan, onPanStart, onPanEnd, onPanSessionStart } = props, onPan, ($$invalidate(7, onPanStart), $$invalidate(4, props)), ($$invalidate(8, onPanEnd), $$invalidate(4, props)), ($$invalidate(9, onPanSessionStart), $$invalidate(4, props)));
    		}

    		if ($$self.$$.dirty & /*onPan, onPanStart, onPanEnd, onPanSessionStart*/ 960) {
    			$$invalidate(1, hasPanEvents = onPan || onPanStart || onPanEnd || onPanSessionStart);
    		}

    		if ($$self.$$.dirty & /*$mcc*/ 1024) {
    			({ transformPagePoint } = $mcc);
    		}

    		if ($$self.$$.dirty & /*onPanSessionStart, onPanStart, onPan, onPanEnd*/ 960) {
    			handlers = {
    				onSessionStart: onPanSessionStart,
    				onStart: onPanStart,
    				onMove: onPan,
    				onEnd: (event, info) => {
    					panSession = null;
    					onPanEnd && onPanEnd(event, info);
    				}
    			};
    		}
    	};

    	return [
    		visualElement,
    		hasPanEvents,
    		mcc,
    		onPointerDown,
    		props,
    		isCustom,
    		onPan,
    		onPanStart,
    		onPanEnd,
    		onPanSessionStart,
    		$mcc,
    		slots,
    		$$scope
    	];
    }

    class UsePanGesture extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { props: 4, visualElement: 0, isCustom: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UsePanGesture",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get props() {
    		throw new Error("<UsePanGesture>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set props(value) {
    		throw new Error("<UsePanGesture>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get visualElement() {
    		throw new Error("<UsePanGesture>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set visualElement(value) {
    		throw new Error("<UsePanGesture>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isCustom() {
    		throw new Error("<UsePanGesture>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isCustom(value) {
    		throw new Error("<UsePanGesture>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var UsePanGesture$1 = UsePanGesture;

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    /**
     * Recursively traverse up the tree to check whether the provided child node
     * is the parent or a descendant of it.
     *
     * @param parent - Element to find
     * @param child - Element to test against parent
     */
    var isNodeOrChild = function (parent, child) {
        if (!child) {
            return false;
        }
        else if (parent === child) {
            return true;
        }
        else {
            return isNodeOrChild(parent, child.parentElement);
        }
    };

    /** 
    based on framer-motion@4.1.17,
    Copyright (c) 2018 Framer B.V.
    */

    function createLock(name) {
        var lock = null;
        return function () {
            var openLock = function () {
                lock = null;
            };
            
            if (lock === null) {
                lock = name;
                return openLock;
            }
            return false;
        };
    }
    var globalHorizontalLock = createLock("dragHorizontal");
    var globalVerticalLock = createLock("dragVertical");
    function getGlobalLock(drag) {
        var lock = false;
        if (drag === "y") {
            
            lock = globalVerticalLock();
        }
        else if (drag === "x") {
            
            lock = globalHorizontalLock();
        }
        else {
            var openHorizontal_1 = globalHorizontalLock();
            var openVertical_1 = globalVerticalLock();
            if (openHorizontal_1 && openVertical_1) {
                lock = function () {
                    openHorizontal_1();
                    openVertical_1();
                };
            }
            else {
                // Release the locks because we don't use them
                if (openHorizontal_1)
                    openHorizontal_1();
                if (openVertical_1)
                    openVertical_1();
            }
        }
        return lock;
    }
    function isDragActive() {
        // Check the gesture lock - if we get it, it means no drag gesture is active
        // and we can safely fire the tap gesture.
        var openGestureLock = getGlobalLock(true);
        if (!openGestureLock)
            return true;
        openGestureLock();
        return false;
    }

    /* node_modules\svelte-motion\src\gestures\UseTapGesture.svelte generated by Svelte v3.55.1 */

    // (73:0) <UsePointerEvent     ref={visualElement}     eventName="pointerdown"     handler={hasPressListeners ? onPointerDown : undefined}>
    function create_default_slot$1(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 512)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(73:0) <UsePointerEvent     ref={visualElement}     eventName=\\\"pointerdown\\\"     handler={hasPressListeners ? onPointerDown : undefined}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let usepointerevent;
    	let current;

    	usepointerevent = new UsePointerEvent$1({
    			props: {
    				ref: /*visualElement*/ ctx[0],
    				eventName: "pointerdown",
    				handler: /*hasPressListeners*/ ctx[1]
    				? /*onPointerDown*/ ctx[2]
    				: undefined,
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(usepointerevent.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(usepointerevent, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const usepointerevent_changes = {};
    			if (dirty & /*visualElement*/ 1) usepointerevent_changes.ref = /*visualElement*/ ctx[0];

    			if (dirty & /*hasPressListeners*/ 2) usepointerevent_changes.handler = /*hasPressListeners*/ ctx[1]
    			? /*onPointerDown*/ ctx[2]
    			: undefined;

    			if (dirty & /*$$scope*/ 512) {
    				usepointerevent_changes.$$scope = { dirty, ctx };
    			}

    			usepointerevent.$set(usepointerevent_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(usepointerevent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(usepointerevent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(usepointerevent, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let onTap;
    	let onTapStart;
    	let onTapCancel;
    	let whileTap;
    	let hasPressListeners;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UseTapGesture', slots, ['default']);
    	let { props, visualElement } = $$props;
    	let isPressing = false;
    	let cancelPointerEndListeners = null;

    	function removePointerEndListener() {
    		cancelPointerEndListeners?.();
    		cancelPointerEndListeners = null;
    	}

    	function checkPointerEnd() {
    		removePointerEndListener();
    		isPressing = false;
    		visualElement.animationState?.setActive(AnimationType.Tap, false);
    		return !isDragActive();
    	}

    	function onPointerUp(event, info) {
    		if (!checkPointerEnd()) return;

    		/**
     * We only count this as a tap gesture if the event.target is the same
     * as, or a child of, this component's element
     */
    		!isNodeOrChild(visualElement.getInstance(), event.target)
    		? onTapCancel?.(event, info)
    		: onTap?.(event, info);
    	}

    	function onPointerCancel(event, info) {
    		if (!checkPointerEnd()) return;
    		onTapCancel?.(event, info);
    	}

    	function onPointerDown(event, info) {
    		if (isPressing) return;
    		removePointerEndListener();
    		isPressing = true;
    		cancelPointerEndListeners = pipe(addPointerEvent(window, "pointerup", onPointerUp), addPointerEvent(window, "pointercancel", onPointerCancel));
    		onTapStart?.(event, info);
    		visualElement.animationState?.setActive(AnimationType.Tap, true);
    	}

    	onDestroy(removePointerEndListener);

    	$$self.$$.on_mount.push(function () {
    		if (props === undefined && !('props' in $$props || $$self.$$.bound[$$self.$$.props['props']])) {
    			console.warn("<UseTapGesture> was created without expected prop 'props'");
    		}

    		if (visualElement === undefined && !('visualElement' in $$props || $$self.$$.bound[$$self.$$.props['visualElement']])) {
    			console.warn("<UseTapGesture> was created without expected prop 'visualElement'");
    		}
    	});

    	const writable_props = ['props', 'visualElement'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UseTapGesture> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('props' in $$props) $$invalidate(3, props = $$props.props);
    		if ('visualElement' in $$props) $$invalidate(0, visualElement = $$props.visualElement);
    		if ('$$scope' in $$props) $$invalidate(9, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		fixed,
    		isNodeOrChild,
    		pipe,
    		isDragActive,
    		onDestroy,
    		UsePointerEvent: UsePointerEvent$1,
    		addPointerEvent,
    		AnimationType,
    		props,
    		visualElement,
    		isPressing,
    		cancelPointerEndListeners,
    		removePointerEndListener,
    		checkPointerEnd,
    		onPointerUp,
    		onPointerCancel,
    		onPointerDown,
    		onTapStart,
    		onTapCancel,
    		onTap,
    		whileTap,
    		hasPressListeners
    	});

    	$$self.$inject_state = $$props => {
    		if ('props' in $$props) $$invalidate(3, props = $$props.props);
    		if ('visualElement' in $$props) $$invalidate(0, visualElement = $$props.visualElement);
    		if ('isPressing' in $$props) isPressing = $$props.isPressing;
    		if ('cancelPointerEndListeners' in $$props) cancelPointerEndListeners = $$props.cancelPointerEndListeners;
    		if ('onTapStart' in $$props) $$invalidate(4, onTapStart = $$props.onTapStart);
    		if ('onTapCancel' in $$props) $$invalidate(5, onTapCancel = $$props.onTapCancel);
    		if ('onTap' in $$props) $$invalidate(6, onTap = $$props.onTap);
    		if ('whileTap' in $$props) $$invalidate(7, whileTap = $$props.whileTap);
    		if ('hasPressListeners' in $$props) $$invalidate(1, hasPressListeners = $$props.hasPressListeners);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*props*/ 8) {
    			$$invalidate(6, { onTap, onTapStart, onTapCancel, whileTap } = props, onTap, ($$invalidate(4, onTapStart), $$invalidate(3, props)), ($$invalidate(5, onTapCancel), $$invalidate(3, props)), ($$invalidate(7, whileTap), $$invalidate(3, props)));
    		}

    		if ($$self.$$.dirty & /*onTap, onTapStart, onTapCancel, whileTap*/ 240) {
    			$$invalidate(1, hasPressListeners = onTap || onTapStart || onTapCancel || whileTap);
    		}
    	};

    	return [
    		visualElement,
    		hasPressListeners,
    		onPointerDown,
    		props,
    		onTapStart,
    		onTapCancel,
    		onTap,
    		whileTap,
    		slots,
    		$$scope
    	];
    }

    class UseTapGesture extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { props: 3, visualElement: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UseTapGesture",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get props() {
    		throw new Error("<UseTapGesture>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set props(value) {
    		throw new Error("<UseTapGesture>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get visualElement() {
    		throw new Error("<UseTapGesture>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set visualElement(value) {
    		throw new Error("<UseTapGesture>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var UseTapGesture$1 = UseTapGesture;

    /* node_modules\svelte-motion\src\gestures\UseHoverGesture.svelte generated by Svelte v3.55.1 */

    function create_fragment$9(ctx) {
    	let usepointerevent0;
    	let t0;
    	let usepointerevent1;
    	let t1;
    	let current;

    	usepointerevent0 = new UsePointerEvent$1({
    			props: {
    				ref: /*visualElement*/ ctx[0],
    				eventName: "pointerenter",
    				handler: /*onHoverStart*/ ctx[1] || /*whileHover*/ ctx[3]
    				? createHoverEvent(/*visualElement*/ ctx[0], true, /*onHoverStart*/ ctx[1])
    				: undefined
    			},
    			$$inline: true
    		});

    	usepointerevent1 = new UsePointerEvent$1({
    			props: {
    				ref: /*visualElement*/ ctx[0],
    				eventName: "pointerleave",
    				handler: /*onHoverEnd*/ ctx[2] || /*whileHover*/ ctx[3]
    				? createHoverEvent(/*visualElement*/ ctx[0], false, /*onHoverEnd*/ ctx[2])
    				: undefined
    			},
    			$$inline: true
    		});

    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	const block = {
    		c: function create() {
    			create_component(usepointerevent0.$$.fragment);
    			t0 = space();
    			create_component(usepointerevent1.$$.fragment);
    			t1 = space();
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(usepointerevent0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(usepointerevent1, target, anchor);
    			insert_dev(target, t1, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const usepointerevent0_changes = {};
    			if (dirty & /*visualElement*/ 1) usepointerevent0_changes.ref = /*visualElement*/ ctx[0];

    			if (dirty & /*onHoverStart, whileHover, visualElement*/ 11) usepointerevent0_changes.handler = /*onHoverStart*/ ctx[1] || /*whileHover*/ ctx[3]
    			? createHoverEvent(/*visualElement*/ ctx[0], true, /*onHoverStart*/ ctx[1])
    			: undefined;

    			usepointerevent0.$set(usepointerevent0_changes);
    			const usepointerevent1_changes = {};
    			if (dirty & /*visualElement*/ 1) usepointerevent1_changes.ref = /*visualElement*/ ctx[0];

    			if (dirty & /*onHoverEnd, whileHover, visualElement*/ 13) usepointerevent1_changes.handler = /*onHoverEnd*/ ctx[2] || /*whileHover*/ ctx[3]
    			? createHoverEvent(/*visualElement*/ ctx[0], false, /*onHoverEnd*/ ctx[2])
    			: undefined;

    			usepointerevent1.$set(usepointerevent1_changes);

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(usepointerevent0.$$.fragment, local);
    			transition_in(usepointerevent1.$$.fragment, local);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(usepointerevent0.$$.fragment, local);
    			transition_out(usepointerevent1.$$.fragment, local);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(usepointerevent0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(usepointerevent1, detaching);
    			if (detaching) detach_dev(t1);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function createHoverEvent(visualElement, isActive, callback) {
    	return (event, info) => {
    		if (!isMouseEvent(event) || isDragActive()) return;
    		callback?.(event, info);
    		visualElement.animationState?.setActive(AnimationType.Hover, isActive);
    	};
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UseHoverGesture', slots, ['default']);
    	let { props, visualElement } = $$props;
    	let { onHoverStart, onHoverEnd, whileHover } = props;

    	$$self.$$.on_mount.push(function () {
    		if (props === undefined && !('props' in $$props || $$self.$$.bound[$$self.$$.props['props']])) {
    			console.warn("<UseHoverGesture> was created without expected prop 'props'");
    		}

    		if (visualElement === undefined && !('visualElement' in $$props || $$self.$$.bound[$$self.$$.props['visualElement']])) {
    			console.warn("<UseHoverGesture> was created without expected prop 'visualElement'");
    		}
    	});

    	const writable_props = ['props', 'visualElement'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UseHoverGesture> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('props' in $$props) $$invalidate(4, props = $$props.props);
    		if ('visualElement' in $$props) $$invalidate(0, visualElement = $$props.visualElement);
    		if ('$$scope' in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		isDragActive,
    		createHoverEvent,
    		UsePointerEvent: UsePointerEvent$1,
    		AnimationType,
    		isMouseEvent,
    		props,
    		visualElement,
    		onHoverStart,
    		onHoverEnd,
    		whileHover
    	});

    	$$self.$inject_state = $$props => {
    		if ('props' in $$props) $$invalidate(4, props = $$props.props);
    		if ('visualElement' in $$props) $$invalidate(0, visualElement = $$props.visualElement);
    		if ('onHoverStart' in $$props) $$invalidate(1, onHoverStart = $$props.onHoverStart);
    		if ('onHoverEnd' in $$props) $$invalidate(2, onHoverEnd = $$props.onHoverEnd);
    		if ('whileHover' in $$props) $$invalidate(3, whileHover = $$props.whileHover);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*props*/ 16) {
    			$$invalidate(1, { onHoverStart, onHoverEnd, whileHover } = props, onHoverStart, ($$invalidate(2, onHoverEnd), $$invalidate(4, props)), ($$invalidate(3, whileHover), $$invalidate(4, props)));
    		}
    	};

    	return [visualElement, onHoverStart, onHoverEnd, whileHover, props, $$scope, slots];
    }

    class UseHoverGesture extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { props: 4, visualElement: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UseHoverGesture",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get props() {
    		throw new Error("<UseHoverGesture>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set props(value) {
    		throw new Error("<UseHoverGesture>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get visualElement() {
    		throw new Error("<UseHoverGesture>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set visualElement(value) {
    		throw new Error("<UseHoverGesture>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var UseHoverGesture$1 = UseHoverGesture;

    /* node_modules\svelte-motion\src\gestures\UseFocusGesture.svelte generated by Svelte v3.55.1 */

    // (22:4) <UseDomEvent ref={visualElement} eventName="blur" handler={whileFocus ? onBlur : undefined}>
    function create_default_slot_1(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 64)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[6],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[6], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(22:4) <UseDomEvent ref={visualElement} eventName=\\\"blur\\\" handler={whileFocus ? onBlur : undefined}>",
    		ctx
    	});

    	return block;
    }

    // (21:0) <UseDomEvent ref={visualElement} eventName="focus" handler={whileFocus ? onFocus : undefined}>
    function create_default_slot(ctx) {
    	let usedomevent;
    	let current;

    	usedomevent = new UseDomEvent$1({
    			props: {
    				ref: /*visualElement*/ ctx[0],
    				eventName: "blur",
    				handler: /*whileFocus*/ ctx[1] ? /*onBlur*/ ctx[3] : undefined,
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(usedomevent.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(usedomevent, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const usedomevent_changes = {};
    			if (dirty & /*visualElement*/ 1) usedomevent_changes.ref = /*visualElement*/ ctx[0];
    			if (dirty & /*whileFocus*/ 2) usedomevent_changes.handler = /*whileFocus*/ ctx[1] ? /*onBlur*/ ctx[3] : undefined;

    			if (dirty & /*$$scope*/ 64) {
    				usedomevent_changes.$$scope = { dirty, ctx };
    			}

    			usedomevent.$set(usedomevent_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(usedomevent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(usedomevent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(usedomevent, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(21:0) <UseDomEvent ref={visualElement} eventName=\\\"focus\\\" handler={whileFocus ? onFocus : undefined}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let usedomevent;
    	let current;

    	usedomevent = new UseDomEvent$1({
    			props: {
    				ref: /*visualElement*/ ctx[0],
    				eventName: "focus",
    				handler: /*whileFocus*/ ctx[1] ? /*onFocus*/ ctx[2] : undefined,
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(usedomevent.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(usedomevent, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const usedomevent_changes = {};
    			if (dirty & /*visualElement*/ 1) usedomevent_changes.ref = /*visualElement*/ ctx[0];
    			if (dirty & /*whileFocus*/ 2) usedomevent_changes.handler = /*whileFocus*/ ctx[1] ? /*onFocus*/ ctx[2] : undefined;

    			if (dirty & /*$$scope, visualElement, whileFocus*/ 67) {
    				usedomevent_changes.$$scope = { dirty, ctx };
    			}

    			usedomevent.$set(usedomevent_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(usedomevent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(usedomevent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(usedomevent, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let whileFocus;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UseFocusGesture', slots, ['default']);
    	let { props, visualElement } = $$props;

    	const onFocus = () => {
    		visualElement.animationState?.setActive(AnimationType.Focus, true);
    	};

    	const onBlur = () => {
    		visualElement.animationState?.setActive(AnimationType.Focus, false);
    	};

    	$$self.$$.on_mount.push(function () {
    		if (props === undefined && !('props' in $$props || $$self.$$.bound[$$self.$$.props['props']])) {
    			console.warn("<UseFocusGesture> was created without expected prop 'props'");
    		}

    		if (visualElement === undefined && !('visualElement' in $$props || $$self.$$.bound[$$self.$$.props['visualElement']])) {
    			console.warn("<UseFocusGesture> was created without expected prop 'visualElement'");
    		}
    	});

    	const writable_props = ['props', 'visualElement'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UseFocusGesture> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('props' in $$props) $$invalidate(4, props = $$props.props);
    		if ('visualElement' in $$props) $$invalidate(0, visualElement = $$props.visualElement);
    		if ('$$scope' in $$props) $$invalidate(6, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		UseDomEvent: UseDomEvent$1,
    		AnimationType,
    		props,
    		visualElement,
    		onFocus,
    		onBlur,
    		whileFocus
    	});

    	$$self.$inject_state = $$props => {
    		if ('props' in $$props) $$invalidate(4, props = $$props.props);
    		if ('visualElement' in $$props) $$invalidate(0, visualElement = $$props.visualElement);
    		if ('whileFocus' in $$props) $$invalidate(1, whileFocus = $$props.whileFocus);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*props*/ 16) {
    			$$invalidate(1, { whileFocus } = props, whileFocus);
    		}
    	};

    	return [visualElement, whileFocus, onFocus, onBlur, props, slots, $$scope];
    }

    class UseFocusGesture extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { props: 4, visualElement: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UseFocusGesture",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get props() {
    		throw new Error("<UseFocusGesture>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set props(value) {
    		throw new Error("<UseFocusGesture>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get visualElement() {
    		throw new Error("<UseFocusGesture>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set visualElement(value) {
    		throw new Error("<UseFocusGesture>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var UseFocusGesture$1 = UseFocusGesture;

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */


    const createMotionClass = (features)=>{
        features && loadFeatures(features);
        return Motion$1;           
    };

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */
    /**
     * @public
     */
    const gestureAnimations = {
        tap: UseTapGesture$1,
        focus: UseFocusGesture$1,
        hover: UseHoverGesture$1,
    };

    /** 
    based on framer-motion@4.1.17,
    Copyright (c) 2018 Framer B.V.
    */

    /**
     * Apply constraints to a point. These constraints are both physical along an
     * axis, and an elastic factor that determines how much to constrain the point
     * by if it does lie outside the defined parameters.
     */
    function applyConstraints(point, _a, elastic) {
        var min = _a.min, max = _a.max;
        if (min !== undefined && point < min) {
            // If we have a min point defined, and this is outside of that, constrain
            point = elastic ? mix(min, point, elastic.min) : Math.max(point, min);
        }
        else if (max !== undefined && point > max) {
            // If we have a max point defined, and this is outside of that, constrain
            point = elastic ? mix(max, point, elastic.max) : Math.min(point, max);
        }
        return point;
    }
    /**
     * Calculates a min projection point based on a pointer, pointer progress
     * within the drag target, and constraints.
     *
     * For instance if an element was 100px width, we were dragging from 0.25
     * along this axis, the pointer is at 200px, and there were no constraints,
     * we would calculate a min projection point of 175px.
     */
    function calcConstrainedMinPoint(point, length, progress, constraints, elastic) {
        // Calculate a min point for this axis and apply it to the current pointer
        var min = point - length * progress;
        return constraints ? applyConstraints(min, constraints, elastic) : min;
    }
    /**
     * Calculate constraints in terms of the viewport when defined relatively to the
     * measured axis. This is measured from the nearest edge, so a max constraint of 200
     * on an axis with a max value of 300 would return a constraint of 500 - axis length
     */
    function calcRelativeAxisConstraints(axis, min, max) {
        return {
            min: min !== undefined ? axis.min + min : undefined,
            max: max !== undefined
                ? axis.max + max - (axis.max - axis.min)
                : undefined,
        };
    }
    /**
     * Calculate constraints in terms of the viewport when
     * defined relatively to the measured bounding box.
     */
    function calcRelativeConstraints(layoutBox, _a) {
        var top = _a.top, left = _a.left, bottom = _a.bottom, right = _a.right;
        return {
            x: calcRelativeAxisConstraints(layoutBox.x, left, right),
            y: calcRelativeAxisConstraints(layoutBox.y, top, bottom),
        };
    }
    /**
     * Calculate viewport constraints when defined as another viewport-relative axis
     */
    function calcViewportAxisConstraints(layoutAxis, constraintsAxis) {
        var _a;
        var min = constraintsAxis.min - layoutAxis.min;
        var max = constraintsAxis.max - layoutAxis.max;
        // If the constraints axis is actually smaller than the layout axis then we can
        // flip the constraints
        if (constraintsAxis.max - constraintsAxis.min <
            layoutAxis.max - layoutAxis.min) {
            _a = __read([max, min], 2), min = _a[0], max = _a[1];
        }
        return {
            min: layoutAxis.min + min,
            max: layoutAxis.min + max,
        };
    }
    /**
     * Calculate viewport constraints when defined as another viewport-relative box
     */
    function calcViewportConstraints(layoutBox, constraintsBox) {
        return {
            x: calcViewportAxisConstraints(layoutBox.x, constraintsBox.x),
            y: calcViewportAxisConstraints(layoutBox.y, constraintsBox.y),
        };
    }
    /**
     * Calculate the an axis position based on two axes and a progress value.
     */
    function calcPositionFromProgress(axis, constraints, progress) {
        var axisLength = axis.max - axis.min;
        var min = mix(constraints.min, constraints.max - axisLength, progress);
        return { min: min, max: min + axisLength };
    }
    /**
     * Rebase the calculated viewport constraints relative to the layout.min point.
     */
    function rebaseAxisConstraints(layout, constraints) {
        var relativeConstraints = {};
        if (constraints.min !== undefined) {
            relativeConstraints.min = constraints.min - layout.min;
        }
        if (constraints.max !== undefined) {
            relativeConstraints.max = constraints.max - layout.min;
        }
        return relativeConstraints;
    }
    var defaultElastic = 0.35;
    /**
     * Accepts a dragElastic prop and returns resolved elastic values for each axis.
     */
    function resolveDragElastic(dragElastic) {
        if (dragElastic === false) {
            dragElastic = 0;
        }
        else if (dragElastic === true) {
            dragElastic = defaultElastic;
        }
        return {
            x: resolveAxisElastic(dragElastic, "left", "right"),
            y: resolveAxisElastic(dragElastic, "top", "bottom"),
        };
    }
    function resolveAxisElastic(dragElastic, minLabel, maxLabel) {
        return {
            min: resolvePointElastic(dragElastic, minLabel),
            max: resolvePointElastic(dragElastic, maxLabel),
        };
    }
    function resolvePointElastic(dragElastic, label) {
        var _a;
        return typeof dragElastic === "number"
            ? dragElastic
            : (_a = dragElastic[label]) !== null && _a !== void 0 ? _a : 0;
    }

    /** 
    based on framer-motion@4.1.11,
    Copyright (c) 2018 Framer B.V.
    */

    /**
     * Returns a boolean stating whether or not we converted the projection
     * to relative projection.
     */
    function convertToRelativeProjection(visualElement, isLayoutDrag) {
        if (isLayoutDrag === void 0) { isLayoutDrag = true; }
        var projectionParent = visualElement.getProjectionParent();
        if (!projectionParent)
            return false;
        var offset;
        if (isLayoutDrag) {
            offset = calcRelativeOffset(projectionParent.projection.target, visualElement.projection.target);
            removeBoxTransforms(offset, projectionParent.getLatestValues());
        }
        else {
            offset = calcRelativeOffset(projectionParent.getLayoutState().layout, visualElement.getLayoutState().layout);
        }
        eachAxis(function (axis) {
            return visualElement.setProjectionTargetAxis(axis, offset[axis].min, offset[axis].max, true);
        });
        return true;
    }

    /** 
    based on framer-motion@4.1.15,
    Copyright (c) 2018 Framer B.V.
    */

    var elementDragControls = new WeakMap();
    /**
     *
     */
    var lastPointerEvent;
    var VisualElementDragControls = /** @class */ (function () {
        function VisualElementDragControls(_a) {
            var visualElement = _a.visualElement;
            /**
             * Track whether we're currently dragging.
             *
             * @internal
             */
            this.isDragging = false;
            /**
             * The current direction of drag, or `null` if both.
             *
             * @internal
             */
            this.currentDirection = null;
            /**
             * The permitted boundaries of travel, in pixels.
             *
             * @internal
             */
            this.constraints = false;
            /**
             * The per-axis resolved elastic values.
             *
             * @internal
             */
            this.elastic = axisBox();
            /**
             * A reference to the host component's latest props.
             *
             * @internal
             */
            this.props = {};
            /**
             * @internal
             */
            this.hasMutatedConstraints = false;
            /**
             * Track the initial position of the cursor relative to the dragging element
             * when dragging starts as a value of 0-1 on each axis. We then use this to calculate
             * an ideal bounding box for the VisualElement renderer to project into every frame.
             *
             * @internal
             */
            this.cursorProgress = {
                x: 0.5,
                y: 0.5,
            };
            // When updating _dragX, or _dragY instead of the VisualElement,
            // persist their values between drag gestures.
            this.originPoint = {};
            // This is a reference to the global drag gesture lock, ensuring only one component
            // can "capture" the drag of one or both axes.
            // TODO: Look into moving this into pansession?
            this.openGlobalLock = null;
            /**
             * @internal
             */
            this.panSession = null;
            this.visualElement = visualElement;
            this.visualElement.enableLayoutProjection();
            elementDragControls.set(visualElement, this);
        }
        /**
         * Instantiate a PanSession for the drag gesture
         *
         * @public
         */
        VisualElementDragControls.prototype.start = function (originEvent, _a) {
            var _this = this;
            var _b = _a === void 0 ? {} : _a, _c = _b.snapToCursor, snapToCursor = _c === void 0 ? false : _c, cursorProgress = _b.cursorProgress;
            var onSessionStart = function (event) {
                var _a;
                // Stop any animations on both axis values immediately. This allows the user to throw and catch
                // the component.
                _this.stopMotion();
                /**
                 * Save the initial point. We'll use this to calculate the pointer's position rather
                 * than the one we receive when the gesture actually starts. By then, the pointer will
                 * have already moved, and the perception will be of the pointer "slipping" across the element
                 */
                var initialPoint = getViewportPointFromEvent(event).point;
                (_a = _this.cancelLayout) === null || _a === void 0 ? void 0 : _a.call(_this);
                _this.cancelLayout = batchLayout(function (read, write) {
                    var ancestors = collectProjectingAncestors(_this.visualElement);
                    var children = collectProjectingChildren(_this.visualElement);
                    var tree = __spreadArray(__spreadArray([], __read(ancestors)), __read(children));
                    var hasManuallySetCursorOrigin = false;
                    /**
                     * Apply a simple lock to the projection target. This ensures no animations
                     * can run on the projection box while this lock is active.
                     */
                    _this.isLayoutDrag() && _this.visualElement.lockProjectionTarget();
                    write(function () {
                        tree.forEach(function (element) { return element.resetTransform(); });
                    });
                    read(function () {
                        updateLayoutMeasurement(_this.visualElement);
                        children.forEach(updateLayoutMeasurement);
                    });
                    write(function () {
                        tree.forEach(function (element) { return element.restoreTransform(); });
                        if (snapToCursor) {
                            hasManuallySetCursorOrigin = _this.snapToCursor(initialPoint);
                        }
                    });
                    read(function () {
                        var isRelativeDrag = Boolean(_this.getAxisMotionValue("x") && !_this.isExternalDrag());
                        if (!isRelativeDrag) {
                            _this.visualElement.rebaseProjectionTarget(true, _this.visualElement.measureViewportBox(false));
                        }
                        _this.visualElement.scheduleUpdateLayoutProjection();
                        /**
                         * When dragging starts, we want to find where the cursor is relative to the bounding box
                         * of the element. Every frame, we calculate a new bounding box using this relative position
                         * and let the visualElement renderer figure out how to reproject the element into this bounding
                         * box.
                         *
                         * By doing it this way, rather than applying an x/y transform directly to the element,
                         * we can ensure the component always visually sticks to the cursor as we'd expect, even
                         * if the DOM element itself changes layout as a result of React updates the user might
                         * make based on the drag position.
                         */
                        var projection = _this.visualElement.projection;
                        eachAxis(function (axis) {
                            if (!hasManuallySetCursorOrigin) {
                                var _a = projection.target[axis], min = _a.min, max = _a.max;
                                _this.cursorProgress[axis] = cursorProgress
                                    ? cursorProgress[axis]
                                    : progress(min, max, initialPoint[axis]);
                            }
                            /**
                             * If we have external drag MotionValues, record their origin point. On pointermove
                             * we'll apply the pan gesture offset directly to this value.
                             */
                            var axisValue = _this.getAxisMotionValue(axis);
                            if (axisValue) {
                                _this.originPoint[axis] = axisValue.get();
                            }
                        });
                    });
                    write(function () {
                        flushSync.update();
                        flushSync.preRender();
                        flushSync.render();
                        flushSync.postRender();
                    });
                    read(function () { return _this.resolveDragConstraints(); });
                });
            };
            var onStart = function (event, info) {
                var _a, _b, _c;
                // Attempt to grab the global drag gesture lock - maybe make this part of PanSession
                var _d = _this.props, drag = _d.drag, dragPropagation = _d.dragPropagation;
                if (drag && !dragPropagation) {
                    if (_this.openGlobalLock)
                        _this.openGlobalLock();
                    _this.openGlobalLock = getGlobalLock(drag);
                    // If we don 't have the lock, don't start dragging
                    if (!_this.openGlobalLock)
                        return;
                }
                flushLayout();
                // Set current drag status
                _this.isDragging = true;
                _this.currentDirection = null;
                // Fire onDragStart event
                (_b = (_a = _this.props).onDragStart) === null || _b === void 0 ? void 0 : _b.call(_a, event, info);
                (_c = _this.visualElement.animationState) === null || _c === void 0 ? void 0 : _c.setActive(AnimationType.Drag, true);
            };
            var onMove = function (event, info) {
                var _a, _b, _c, _d;
                var _e = _this.props, dragPropagation = _e.dragPropagation, dragDirectionLock = _e.dragDirectionLock;
                // If we didn't successfully receive the gesture lock, early return.
                if (!dragPropagation && !_this.openGlobalLock)
                    return;
                var offset = info.offset;
                // Attempt to detect drag direction if directionLock is true
                if (dragDirectionLock && _this.currentDirection === null) {
                    _this.currentDirection = getCurrentDirection(offset);
                    // If we've successfully set a direction, notify listener
                    if (_this.currentDirection !== null) {
                        (_b = (_a = _this.props).onDirectionLock) === null || _b === void 0 ? void 0 : _b.call(_a, _this.currentDirection);
                    }
                    return;
                }
                // Update each point with the latest position
                _this.updateAxis("x", info.point, offset);
                _this.updateAxis("y", info.point, offset);
                // Fire onDrag event
                (_d = (_c = _this.props).onDrag) === null || _d === void 0 ? void 0 : _d.call(_c, event, info);
                // Update the last pointer event
                lastPointerEvent = event;
            };
            var onSessionEnd = function (event, info) {
                return _this.stop(event, info);
            };
            var transformPagePoint = this.props.transformPagePoint;
            this.panSession = new PanSession(originEvent, {
                onSessionStart: onSessionStart,
                onStart: onStart,
                onMove: onMove,
                onSessionEnd: onSessionEnd,
            }, { transformPagePoint: transformPagePoint });
        };
        VisualElementDragControls.prototype.resolveDragConstraints = function () {
            var _this = this;
            var _a = this.props, dragConstraints = _a.dragConstraints, dragElastic = _a.dragElastic;
            var layout = this.visualElement.getLayoutState().layoutCorrected;
            if (dragConstraints) {
                this.constraints = isRefObject(dragConstraints)
                    ? this.resolveRefConstraints(layout, dragConstraints)
                    : calcRelativeConstraints(layout, dragConstraints);
            }
            else {
                this.constraints = false;
            }
            this.elastic = resolveDragElastic(dragElastic);
            /**
             * If we're outputting to external MotionValues, we want to rebase the measured constraints
             * from viewport-relative to component-relative.
             */
            if (this.constraints && !this.hasMutatedConstraints) {
                eachAxis(function (axis) {
                    if (_this.getAxisMotionValue(axis)) {
                        _this.constraints[axis] = rebaseAxisConstraints(layout[axis], _this.constraints[axis]);
                    }
                });
            }
        };
        VisualElementDragControls.prototype.resolveRefConstraints = function (layoutBox, constraints) {
            var _a = this.props, onMeasureDragConstraints = _a.onMeasureDragConstraints, transformPagePoint = _a.transformPagePoint;
            var constraintsElement = constraints.current;
            invariant(constraintsElement !== null, "If `dragConstraints` is set as a React ref, that ref must be passed to another component's `ref` prop.");
            this.constraintsBox = getBoundingBox(constraintsElement, transformPagePoint);
            var measuredConstraints = calcViewportConstraints(layoutBox, this.constraintsBox);
            /**
             * If there's an onMeasureDragConstraints listener we call it and
             * if different constraints are returned, set constraints to that
             */
            if (onMeasureDragConstraints) {
                var userConstraints = onMeasureDragConstraints(convertAxisBoxToBoundingBox(measuredConstraints));
                this.hasMutatedConstraints = !!userConstraints;
                if (userConstraints) {
                    measuredConstraints = convertBoundingBoxToAxisBox(userConstraints);
                }
            }
            return measuredConstraints;
        };
        VisualElementDragControls.prototype.cancelDrag = function () {
            var _a, _b;
            this.visualElement.unlockProjectionTarget();
            (_a = this.cancelLayout) === null || _a === void 0 ? void 0 : _a.call(this);
            this.isDragging = false;
            this.panSession && this.panSession.end();
            this.panSession = null;
            if (!this.props.dragPropagation && this.openGlobalLock) {
                this.openGlobalLock();
                this.openGlobalLock = null;
            }
            (_b = this.visualElement.animationState) === null || _b === void 0 ? void 0 : _b.setActive(AnimationType.Drag, false);
        };
        VisualElementDragControls.prototype.stop = function (event, info) {
            var _a, _b, _c;
            (_a = this.panSession) === null || _a === void 0 ? void 0 : _a.end();
            this.panSession = null;
            var isDragging = this.isDragging;
            this.cancelDrag();
            if (!isDragging)
                return;
            var velocity = info.velocity;
            this.animateDragEnd(velocity);
            (_c = (_b = this.props).onDragEnd) === null || _c === void 0 ? void 0 : _c.call(_b, event, info);
        };
        VisualElementDragControls.prototype.snapToCursor = function (point) {
            var _this = this;
            return eachAxis(function (axis) {
                var drag = _this.props.drag;
                // If we're not dragging this axis, do an early return.
                if (!shouldDrag(axis, drag, _this.currentDirection))
                    return;
                var axisValue = _this.getAxisMotionValue(axis);
                if (axisValue) {
                    var box = _this.visualElement.getLayoutState().layout;
                    var length_1 = box[axis].max - box[axis].min;
                    var center = box[axis].min + length_1 / 2;
                    var offset = point[axis] - center;
                    _this.originPoint[axis] = point[axis];
                    axisValue.set(offset);
                }
                else {
                    _this.cursorProgress[axis] = 0.5;
                    return true;
                }
            }).includes(true);
        };
        /**
         * Update the specified axis with the latest pointer information.
         */
        VisualElementDragControls.prototype.updateAxis = function (axis, point, offset) {
            var drag = this.props.drag;
            // If we're not dragging this axis, do an early return.
            if (!shouldDrag(axis, drag, this.currentDirection))
                return;
            return this.getAxisMotionValue(axis)
                ? this.updateAxisMotionValue(axis, offset)
                : this.updateVisualElementAxis(axis, point);
        };
        VisualElementDragControls.prototype.updateAxisMotionValue = function (axis, offset) {
            var axisValue = this.getAxisMotionValue(axis);
            if (!offset || !axisValue)
                return;
            var nextValue = this.originPoint[axis] + offset[axis];
            var update = this.constraints
                ? applyConstraints(nextValue, this.constraints[axis], this.elastic[axis])
                : nextValue;
            axisValue.set(update);
        };
        VisualElementDragControls.prototype.updateVisualElementAxis = function (axis, point) {
            var _a;
            // Get the actual layout bounding box of the element
            var axisLayout = this.visualElement.getLayoutState().layout[axis];
            // Calculate its current length. In the future we might want to lerp this to animate
            // between lengths if the layout changes as we change the DOM
            var axisLength = axisLayout.max - axisLayout.min;
            // Get the initial progress that the pointer sat on this axis on gesture start.
            var axisProgress = this.cursorProgress[axis];
            // Calculate a new min point based on the latest pointer position, constraints and elastic
            var min = calcConstrainedMinPoint(point[axis], axisLength, axisProgress, (_a = this.constraints) === null || _a === void 0 ? void 0 : _a[axis], this.elastic[axis]);
            // Update the axis viewport target with this new min and the length
            this.visualElement.setProjectionTargetAxis(axis, min, min + axisLength);
        };
        VisualElementDragControls.prototype.setProps = function (_a) {
            var _b = _a.drag, drag = _b === void 0 ? false : _b, _c = _a.dragDirectionLock, dragDirectionLock = _c === void 0 ? false : _c, _d = _a.dragPropagation, dragPropagation = _d === void 0 ? false : _d, _e = _a.dragConstraints, dragConstraints = _e === void 0 ? false : _e, _f = _a.dragElastic, dragElastic = _f === void 0 ? defaultElastic : _f, _g = _a.dragMomentum, dragMomentum = _g === void 0 ? true : _g, remainingProps = __rest(_a, ["drag", "dragDirectionLock", "dragPropagation", "dragConstraints", "dragElastic", "dragMomentum"]);
            this.props = __assign({ drag: drag,
                dragDirectionLock: dragDirectionLock,
                dragPropagation: dragPropagation,
                dragConstraints: dragConstraints,
                dragElastic: dragElastic,
                dragMomentum: dragMomentum }, remainingProps);
        };
        /**
         * Drag works differently depending on which props are provided.
         *
         * - If _dragX and _dragY are provided, we output the gesture delta directly to those motion values.
         * - If the component will perform layout animations, we output the gesture to the component's
         *      visual bounding box
         * - Otherwise, we apply the delta to the x/y motion values.
         */
        VisualElementDragControls.prototype.getAxisMotionValue = function (axis) {
            var _a = this.props, layout = _a.layout, layoutId = _a.layoutId;
            var dragKey = "_drag" + axis.toUpperCase();
            if (this.props[dragKey]) {
                return this.props[dragKey];
            }
            else if (!layout && layoutId === undefined) {
                return this.visualElement.getValue(axis, 0);
            }
        };
        VisualElementDragControls.prototype.isLayoutDrag = function () {
            return !this.getAxisMotionValue("x");
        };
        VisualElementDragControls.prototype.isExternalDrag = function () {
            var _a = this.props, _dragX = _a._dragX, _dragY = _a._dragY;
            return _dragX || _dragY;
        };
        VisualElementDragControls.prototype.animateDragEnd = function (velocity) {
            var _this = this;
            var _a = this.props, drag = _a.drag, dragMomentum = _a.dragMomentum, dragElastic = _a.dragElastic, dragTransition = _a.dragTransition;
            /**
             * Everything beyond the drag gesture should be performed with
             * relative projection so children stay in sync with their parent element.
             */
            var isRelative = convertToRelativeProjection(this.visualElement, this.isLayoutDrag() && !this.isExternalDrag());
            /**
             * If we had previously resolved constraints relative to the viewport,
             * we need to also convert those to a relative coordinate space for the animation
             */
            var constraints = this.constraints || {};
            if (isRelative &&
                Object.keys(constraints).length &&
                this.isLayoutDrag()) {
                var projectionParent = this.visualElement.getProjectionParent();
                if (projectionParent) {
                    var relativeConstraints_1 = calcRelativeOffset(projectionParent.projection.targetFinal, constraints);
                    eachAxis(function (axis) {
                        var _a = relativeConstraints_1[axis], min = _a.min, max = _a.max;
                        constraints[axis] = {
                            min: isNaN(min) ? undefined : min,
                            max: isNaN(max) ? undefined : max,
                        };
                    });
                }
            }
            var momentumAnimations = eachAxis(function (axis) {
                var _a;
                if (!shouldDrag(axis, drag, _this.currentDirection)) {
                    return;
                }
                var transition = (_a = constraints === null || constraints === void 0 ? void 0 : constraints[axis]) !== null && _a !== void 0 ? _a : {};
                /**
                 * Overdamp the boundary spring if `dragElastic` is disabled. There's still a frame
                 * of spring animations so we should look into adding a disable spring option to `inertia`.
                 * We could do something here where we affect the `bounceStiffness` and `bounceDamping`
                 * using the value of `dragElastic`.
                 */
                var bounceStiffness = dragElastic ? 200 : 1000000;
                var bounceDamping = dragElastic ? 40 : 10000000;
                var inertia = __assign(__assign({ type: "inertia", velocity: dragMomentum ? velocity[axis] : 0, bounceStiffness: bounceStiffness,
                    bounceDamping: bounceDamping, timeConstant: 750, restDelta: 1, restSpeed: 10 }, dragTransition), transition);
                // If we're not animating on an externally-provided `MotionValue` we can use the
                // component's animation controls which will handle interactions with whileHover (etc),
                // otherwise we just have to animate the `MotionValue` itself.
                return _this.getAxisMotionValue(axis)
                    ? _this.startAxisValueAnimation(axis, inertia)
                    : _this.visualElement.startLayoutAnimation(axis, inertia, isRelative);
            });
            // Run all animations and then resolve the new drag constraints.
            return Promise.all(momentumAnimations).then(function () {
                var _a, _b;
                (_b = (_a = _this.props).onDragTransitionEnd) === null || _b === void 0 ? void 0 : _b.call(_a);
            });
        };
        VisualElementDragControls.prototype.stopMotion = function () {
            var _this = this;
            eachAxis(function (axis) {
                var axisValue = _this.getAxisMotionValue(axis);
                axisValue
                    ? axisValue.stop()
                    : _this.visualElement.stopLayoutAnimation();
            });
        };
        VisualElementDragControls.prototype.startAxisValueAnimation = function (axis, transition) {
            var axisValue = this.getAxisMotionValue(axis);
            if (!axisValue)
                return;
            var currentValue = axisValue.get();
            axisValue.set(currentValue);
            axisValue.set(currentValue); // Set twice to hard-reset velocity
            return startAnimation(axis, axisValue, 0, transition);
        };
        VisualElementDragControls.prototype.scalePoint = function () {
            var _this = this;
            var _a = this.props, drag = _a.drag, dragConstraints = _a.dragConstraints;
            if (!isRefObject(dragConstraints) || !this.constraintsBox)
                return;
            // Stop any current animations as there can be some visual glitching if we resize mid animation
            this.stopMotion();
            // Record the relative progress of the targetBox relative to the constraintsBox
            var boxProgress = { x: 0, y: 0 };
            eachAxis(function (axis) {
                boxProgress[axis] = calcOrigin$1(_this.visualElement.projection.target[axis], _this.constraintsBox[axis]);
            });
            /**
             * For each axis, calculate the current progress of the layout axis within the constraints.
             * Then, using the latest layout and constraints measurements, reposition the new layout axis
             * proportionally within the constraints.
             */
            this.updateConstraints(function () {
                eachAxis(function (axis) {
                    if (!shouldDrag(axis, drag, null))
                        return;
                    // Calculate the position of the targetBox relative to the constraintsBox using the
                    // previously calculated progress
                    var _a = calcPositionFromProgress(_this.visualElement.projection.target[axis], _this.constraintsBox[axis], boxProgress[axis]), min = _a.min, max = _a.max;
                    _this.visualElement.setProjectionTargetAxis(axis, min, max);
                });
            });
            /**
             * If any other draggable components are queuing the same tasks synchronously
             * this will wait until they've all been scheduled before flushing.
             */
            setTimeout(flushLayout, 1);
        };
        VisualElementDragControls.prototype.updateConstraints = function (onReady) {
            var _this = this;
            this.cancelLayout = batchLayout(function (read, write) {
                var ancestors = collectProjectingAncestors(_this.visualElement);
                write(function () {
                    return ancestors.forEach(function (element) { return element.resetTransform(); });
                });
                read(function () { return updateLayoutMeasurement(_this.visualElement); });
                write(function () {
                    return ancestors.forEach(function (element) { return element.restoreTransform(); });
                });
                read(function () {
                    _this.resolveDragConstraints();
                });
                if (onReady)
                    write(onReady);
            });
        };
        VisualElementDragControls.prototype.mount = function (visualElement) {
            var _this = this;
            var element = visualElement.getInstance();
            /**
             * Attach a pointerdown event listener on this DOM element to initiate drag tracking.
             */
            var stopPointerListener = addPointerEvent(element, "pointerdown", function (event) {
                var _a = _this.props, drag = _a.drag, _b = _a.dragListener, dragListener = _b === void 0 ? true : _b;
                drag && dragListener && _this.start(event);
            });
            /**
             * Attach a window resize listener to scale the draggable target within its defined
             * constraints as the window resizes.
             */
            var stopResizeListener = addDomEvent(window, "resize", function () {
                _this.scalePoint();
            });
            /**
             * Ensure drag constraints are resolved correctly relative to the dragging element
             * whenever its layout changes.
             */
            var stopLayoutUpdateListener = visualElement.onLayoutUpdate(function () {
                if (_this.isDragging) {
                    _this.resolveDragConstraints();
                }
            });
            /**
             * If the previous component with this same layoutId was dragging at the time
             * it was unmounted, we want to continue the same gesture on this component.
             */
            var prevDragCursor = visualElement.prevDragCursor;
            if (prevDragCursor) {
                this.start(lastPointerEvent, { cursorProgress: prevDragCursor });
            }
            /**
             * Return a function that will teardown the drag gesture
             */
            return function () {
                stopPointerListener === null || stopPointerListener === void 0 ? void 0 : stopPointerListener();
                stopResizeListener === null || stopResizeListener === void 0 ? void 0 : stopResizeListener();
                stopLayoutUpdateListener === null || stopLayoutUpdateListener === void 0 ? void 0 : stopLayoutUpdateListener();
                _this.cancelDrag();
            };
        };
        return VisualElementDragControls;
    }());
    function shouldDrag(direction, drag, currentDirection) {
        return ((drag === true || drag === direction) &&
            (currentDirection === null || currentDirection === direction));
    }
    /**
     * Based on an x/y offset determine the current drag direction. If both axis' offsets are lower
     * than the provided threshold, return `null`.
     *
     * @param offset - The x/y offset from origin.
     * @param lockThreshold - (Optional) - the minimum absolute offset before we can determine a drag direction.
     */
    function getCurrentDirection(offset, lockThreshold) {
        if (lockThreshold === void 0) { lockThreshold = 10; }
        var direction = null;
        if (Math.abs(offset.y) > lockThreshold) {
            direction = "y";
        }
        else if (Math.abs(offset.x) > lockThreshold) {
            direction = "x";
        }
        return direction;
    }

    /* node_modules\svelte-motion\src\gestures\drag\UseDrag.svelte generated by Svelte v3.55.1 */

    function create_fragment$7(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 64)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[6],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[6], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let $mcc;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UseDrag', slots, ['default']);
    	let { visualElement, props, isCustom } = $$props;
    	const mcc = getContext(MotionConfigContext) || MotionConfigContext(isCustom);
    	validate_store(mcc, 'mcc');
    	component_subscribe($$self, mcc, value => $$invalidate(5, $mcc = value));
    	let dragControls = new VisualElementDragControls({ visualElement });

    	// If we've been provided a DragControls for manual control over the drag gesture,
    	// subscribe this component to it on mount.
    	let cleanup;

    	const dragEffect = () => {
    		if (cleanup) {
    			cleanup();
    		}

    		if (groupDragControls) {
    			cleanup = groupDragControls.subscribe(dragControls);
    		}
    	};

    	let { dragControls: groupDragControls } = props;
    	let { transformPagePoint } = get_store_value(mcc);
    	dragControls.setProps({ ...props, transformPagePoint });

    	onDestroy(() => {
    		if (cleanup) {
    			cleanup();
    		}
    	});

    	onMount(() => dragControls.mount(visualElement));

    	$$self.$$.on_mount.push(function () {
    		if (visualElement === undefined && !('visualElement' in $$props || $$self.$$.bound[$$self.$$.props['visualElement']])) {
    			console.warn("<UseDrag> was created without expected prop 'visualElement'");
    		}

    		if (props === undefined && !('props' in $$props || $$self.$$.bound[$$self.$$.props['props']])) {
    			console.warn("<UseDrag> was created without expected prop 'props'");
    		}

    		if (isCustom === undefined && !('isCustom' in $$props || $$self.$$.bound[$$self.$$.props['isCustom']])) {
    			console.warn("<UseDrag> was created without expected prop 'isCustom'");
    		}
    	});

    	const writable_props = ['visualElement', 'props', 'isCustom'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UseDrag> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('visualElement' in $$props) $$invalidate(1, visualElement = $$props.visualElement);
    		if ('props' in $$props) $$invalidate(2, props = $$props.props);
    		if ('isCustom' in $$props) $$invalidate(3, isCustom = $$props.isCustom);
    		if ('$$scope' in $$props) $$invalidate(6, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		MotionConfigContext,
    		VisualElementDragControls,
    		getContext,
    		onDestroy,
    		onMount,
    		get: get_store_value,
    		visualElement,
    		props,
    		isCustom,
    		mcc,
    		dragControls,
    		cleanup,
    		dragEffect,
    		groupDragControls,
    		transformPagePoint,
    		$mcc
    	});

    	$$self.$inject_state = $$props => {
    		if ('visualElement' in $$props) $$invalidate(1, visualElement = $$props.visualElement);
    		if ('props' in $$props) $$invalidate(2, props = $$props.props);
    		if ('isCustom' in $$props) $$invalidate(3, isCustom = $$props.isCustom);
    		if ('dragControls' in $$props) $$invalidate(10, dragControls = $$props.dragControls);
    		if ('cleanup' in $$props) cleanup = $$props.cleanup;
    		if ('groupDragControls' in $$props) groupDragControls = $$props.groupDragControls;
    		if ('transformPagePoint' in $$props) $$invalidate(4, transformPagePoint = $$props.transformPagePoint);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*props*/ 4) {
    			({ dragControls: groupDragControls } = props);
    		}

    		if ($$self.$$.dirty & /*$mcc*/ 32) {
    			//let {transformPagePoint} = get($mcc);
    			$$invalidate(4, { transformPagePoint } = $mcc, transformPagePoint);
    		}

    		if ($$self.$$.dirty & /*props, transformPagePoint*/ 20) {
    			//dragControls.setProps({ ...props, transformPagePoint })
    			dragControls.setProps({ ...props, transformPagePoint });
    		}
    	};

    	dragEffect();
    	return [mcc, visualElement, props, isCustom, transformPagePoint, $mcc, $$scope, slots];
    }

    class UseDrag extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { visualElement: 1, props: 2, isCustom: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UseDrag",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get visualElement() {
    		throw new Error("<UseDrag>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set visualElement(value) {
    		throw new Error("<UseDrag>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get props() {
    		throw new Error("<UseDrag>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set props(value) {
    		throw new Error("<UseDrag>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isCustom() {
    		throw new Error("<UseDrag>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isCustom(value) {
    		throw new Error("<UseDrag>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var UseDrag$1 = UseDrag;

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    /**
     * @public
     */
    const drag = {
        pan: UsePanGesture$1,
        drag: UseDrag$1
    };

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    function pixelsToPercent(pixels, axis) {
        return (pixels / (axis.max - axis.min)) * 100;
    }
    /**
     * We always correct borderRadius as a percentage rather than pixels to reduce paints.
     * For example, if you are projecting a box that is 100px wide with a 10px borderRadius
     * into a box that is 200px wide with a 20px borderRadius, that is actually a 10%
     * borderRadius in both states. If we animate between the two in pixels that will trigger
     * a paint each time. If we animate between the two in percentage we'll avoid a paint.
     */
    function correctBorderRadius(latest, _layoutState, _a) {
        var target = _a.target;
        /**
         * If latest is a string, if it's a percentage we can return immediately as it's
         * going to be stretched appropriately. Otherwise, if it's a pixel, convert it to a number.
         */
        if (typeof latest === "string") {
            if (px.test(latest)) {
                latest = parseFloat(latest);
            }
            else {
                return latest;
            }
        }
        /**
         * If latest is a number, it's a pixel value. We use the current viewportBox to calculate that
         * pixel value as a percentage of each axis
         */
        var x = pixelsToPercent(latest, target.x);
        var y = pixelsToPercent(latest, target.y);
        return x + "% " + y + "%";
    }
    var varToken = "_$css";
    function correctBoxShadow(latest, _a) {
        var delta = _a.delta, treeScale = _a.treeScale;
        var original = latest;
        /**
         * We need to first strip and store CSS variables from the string.
         */
        var containsCSSVariables = latest.includes("var(");
        var cssVariables = [];
        if (containsCSSVariables) {
            latest = latest.replace(cssVariableRegex, function (match) {
                cssVariables.push(match);
                return varToken;
            });
        }
        var shadow = complex.parse(latest);
        // TODO: Doesn't support multiple shadows
        if (shadow.length > 5)
            return original;
        var template = complex.createTransformer(latest);
        var offset = typeof shadow[0] !== "number" ? 1 : 0;
        // Calculate the overall context scale
        var xScale = delta.x.scale * treeScale.x;
        var yScale = delta.y.scale * treeScale.y;
        shadow[0 + offset] /= xScale;
        shadow[1 + offset] /= yScale;
        /**
         * Ideally we'd correct x and y scales individually, but because blur and
         * spread apply to both we have to take a scale average and apply that instead.
         * We could potentially improve the outcome of this by incorporating the ratio between
         * the two scales.
         */
        var averageScale = mix(xScale, yScale, 0.5);
        // Blur
        if (typeof shadow[2 + offset] === "number")
            shadow[2 + offset] /= averageScale;
        // Spread
        if (typeof shadow[3 + offset] === "number")
            shadow[3 + offset] /= averageScale;
        var output = template(shadow);
        if (containsCSSVariables) {
            var i_1 = 0;
            output = output.replace(varToken, function () {
                var cssVariable = cssVariables[i_1];
                i_1++;
                return cssVariable;
            });
        }
        return output;
    }
    var borderCorrectionDefinition = {
        process: correctBorderRadius,
    };
    var defaultScaleCorrectors = {
        borderRadius: __assign(__assign({}, borderCorrectionDefinition), { applyTo: [
                "borderTopLeftRadius",
                "borderTopRightRadius",
                "borderBottomLeftRadius",
                "borderBottomRightRadius",
            ] }),
        borderTopLeftRadius: borderCorrectionDefinition,
        borderTopRightRadius: borderCorrectionDefinition,
        borderBottomLeftRadius: borderCorrectionDefinition,
        borderBottomRightRadius: borderCorrectionDefinition,
        boxShadow: {
            process: correctBoxShadow,
        },
    };

    /* node_modules\svelte-motion\src\motion\features\layout\Animate.svelte generated by Svelte v3.55.1 */

    function create_fragment$6(ctx) {
    	const block = {
    		c: noop$1,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop$1,
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: noop$1
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const progressTarget = 1000;

    function hasMoved(a, b) {
    	return !isZeroBox(a) && !isZeroBox(b) && (!axisIsEqual(a.x, b.x) || !axisIsEqual(a.y, b.y));
    }

    const zeroAxis = { min: 0, max: 0 };

    function isZeroBox(a) {
    	return axisIsEqual(a.x, zeroAxis) && axisIsEqual(a.y, zeroAxis);
    }

    function axisIsEqual(a, b) {
    	return a.min === b.min && a.max === b.max;
    }

    const defaultLayoutTransition = { duration: 0.45, ease: [0.4, 0, 0.1, 1] };

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Animate', slots, []);
    	let { visualElement, layout = undefined, safeToRemove } = $$props;

    	/**
     * A mutable object that tracks the target viewport box
     * for the current animation frame.
     */
    	let frameTarget = axisBox();

    	/**
     * The current animation target, we use this to check whether to start
     * a new animation or continue the existing one.
     */
    	let currentAnimationTarget = axisBox();

    	/**
     * Track whether we're animating this axis.
     */
    	let isAnimating = { x: false, y: false };

    	let stopAxisAnimation = { x: undefined, y: undefined };
    	let unsubLayoutReady;
    	let isAnimatingTree = false;

    	onMount(() => {
    		$$invalidate(0, visualElement.animateMotionValue = startAnimation, visualElement);
    		visualElement.enableLayoutProjection();
    		unsubLayoutReady = visualElement.onLayoutUpdate(animateF);

    		$$invalidate(
    			0,
    			visualElement.layoutSafeToRemove = function () {
    				safeToRemove();
    			},
    			visualElement
    		);

    		addScaleCorrection(defaultScaleCorrectors);
    	});

    	onDestroy(() => {
    		unsubLayoutReady();
    		eachAxis(axis => stopAxisAnimation[axis]?.());
    	});

    	const animateF = (target, origin, { originBox, targetBox, visibilityAction, shouldStackAnimate, onComplete, ...config } = {}) => {
    		/**
     * Early return if we've been instructed not to animate this render.
     */
    		if (shouldStackAnimate === false) {
    			isAnimatingTree = false;
    			return safeToRemove();
    		}

    		/**
     * Prioritise tree animations
     */
    		if (isAnimatingTree && shouldStackAnimate !== true) {
    			return;
    		} else if (shouldStackAnimate) {
    			isAnimatingTree = true;
    		}

    		/**
     * Allow the measured origin (prev bounding box) and target (actual layout) to be
     * overridden by the provided config.
     */
    		origin = originBox || origin;

    		target = targetBox || target;
    		const boxHasMoved = hasMoved(origin, target);

    		const animations = eachAxis(axis => {
    			/**
     * If layout is set to "position", we can resize the origin box based on the target
     * box and only animate its position.
     */
    			if (layout === "position") {
    				const targetLength = target[axis].max - target[axis].min;
    				origin[axis].max = origin[axis].min + targetLength;
    			}

    			if (visualElement.projection.isTargetLocked) {
    				return;
    			} else if (visibilityAction !== undefined) {
    				visualElement.setVisibility(visibilityAction === VisibilityAction.Show);
    			} else if (boxHasMoved) {
    				// If the box has moved, animate between it's current visual state and its
    				// final state
    				return animateAxis(axis, target[axis], origin[axis], config);
    			} else {
    				// If the box has remained in the same place, immediately set the axis target
    				// to the final desired state
    				return visualElement.setProjectionTargetAxis(axis, target[axis].min, target[axis].max);
    			}
    		});

    		// Force a render to ensure there's no flash of uncorrected bounding box.
    		visualElement.syncRender();

    		/**
     * If this visualElement isn't present (ie it's been removed from the tree by the user but
     * kept in by the tree by AnimatePresence) then call safeToRemove when all axis animations
     * have successfully finished.
     */
    		return Promise.all(animations).then(() => {
    			isAnimatingTree = false;
    			onComplete && onComplete();
    			visualElement.notifyLayoutAnimationComplete();
    		});
    	};

    	/**
     * TODO: This manually performs animations on the visualElement's layout progress
     * values. It'd be preferable to amend the startLayoutAxisAnimation
     * API to accept more custom animations like
     */
    	const animateAxis = (axis, target, origin, { transition: _transition } = {}) => {
    		stopAxisAnimation[axis]?.();

    		/**
     * If we're not animating to a new target, don't run this animation
     */
    		if (isAnimating[axis] && axisIsEqual(target, currentAnimationTarget[axis])) {
    			return;
    		}

    		stopAxisAnimation[axis]?.();
    		isAnimating[axis] = true;
    		const _frameTarget = frameTarget[axis];
    		const layoutProgress = visualElement.getProjectionAnimationProgress()[axis];

    		/**
     * Set layout progress back to 0. We set it twice to hard-reset any velocity that might
     * be re-incoporated into a subsequent spring animation.
     */
    		layoutProgress.clearListeners();

    		layoutProgress.set(0);
    		layoutProgress.set(0);

    		/**
     * Create an animation function to run once per frame. This will tween the visual bounding box from
     * origin to target using the latest progress value.
     */
    		const frame = () => {
    			// Convert the latest layoutProgress, which is a value from 0-1000, into a 0-1 progress
    			const p = layoutProgress.get() / progressTarget;

    			// Tween the axis and update the visualElement with the latest values
    			tweenAxis(_frameTarget, origin, target, p);

    			visualElement.setProjectionTargetAxis(axis, _frameTarget.min, _frameTarget.max);
    		};

    		// Synchronously run a frame to ensure there's no flash of the uncorrected bounding box.
    		frame();

    		// Ensure that the layout delta is updated for this frame.
    		//visualElement.updateLayoutProjection();
    		// Create a function to stop animation on this specific axis
    		const unsubscribeProgress = layoutProgress.onChange(frame);

    		stopAxisAnimation[axis] = () => {
    			isAnimating[axis] = false;
    			layoutProgress.stop();
    			unsubscribeProgress();
    		};

    		currentAnimationTarget[axis] = target;
    		const layoutTransition = _transition || visualElement.getDefaultTransition() || defaultLayoutTransition;

    		// Start the animation on this axis
    		const animation = startAnimation(axis === "x" ? "layoutX" : "layoutY", layoutProgress, progressTarget, layoutTransition && getValueTransition(layoutTransition, "layout")).then(stopAxisAnimation[axis]);

    		return animation;
    	};

    	$$self.$$.on_mount.push(function () {
    		if (visualElement === undefined && !('visualElement' in $$props || $$self.$$.bound[$$self.$$.props['visualElement']])) {
    			console.warn("<Animate> was created without expected prop 'visualElement'");
    		}

    		if (safeToRemove === undefined && !('safeToRemove' in $$props || $$self.$$.bound[$$self.$$.props['safeToRemove']])) {
    			console.warn("<Animate> was created without expected prop 'safeToRemove'");
    		}
    	});

    	const writable_props = ['visualElement', 'layout', 'safeToRemove'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Animate> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('visualElement' in $$props) $$invalidate(0, visualElement = $$props.visualElement);
    		if ('layout' in $$props) $$invalidate(1, layout = $$props.layout);
    		if ('safeToRemove' in $$props) $$invalidate(2, safeToRemove = $$props.safeToRemove);
    	};

    	$$self.$capture_state = () => ({
    		progressTarget,
    		hasMoved,
    		zeroAxis,
    		isZeroBox,
    		axisIsEqual,
    		defaultLayoutTransition,
    		onDestroy,
    		onMount,
    		axisBox,
    		eachAxis,
    		startAnimation,
    		getValueTransition,
    		tweenAxis,
    		addScaleCorrection,
    		defaultScaleCorrectors,
    		visualElement,
    		layout,
    		safeToRemove,
    		frameTarget,
    		currentAnimationTarget,
    		isAnimating,
    		stopAxisAnimation,
    		unsubLayoutReady,
    		isAnimatingTree,
    		animateF,
    		animateAxis
    	});

    	$$self.$inject_state = $$props => {
    		if ('visualElement' in $$props) $$invalidate(0, visualElement = $$props.visualElement);
    		if ('layout' in $$props) $$invalidate(1, layout = $$props.layout);
    		if ('safeToRemove' in $$props) $$invalidate(2, safeToRemove = $$props.safeToRemove);
    		if ('frameTarget' in $$props) frameTarget = $$props.frameTarget;
    		if ('currentAnimationTarget' in $$props) currentAnimationTarget = $$props.currentAnimationTarget;
    		if ('isAnimating' in $$props) isAnimating = $$props.isAnimating;
    		if ('stopAxisAnimation' in $$props) stopAxisAnimation = $$props.stopAxisAnimation;
    		if ('unsubLayoutReady' in $$props) unsubLayoutReady = $$props.unsubLayoutReady;
    		if ('isAnimatingTree' in $$props) isAnimatingTree = $$props.isAnimatingTree;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [visualElement, layout, safeToRemove];
    }

    class Animate extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
    			visualElement: 0,
    			layout: 1,
    			safeToRemove: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Animate",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get visualElement() {
    		throw new Error("<Animate>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set visualElement(value) {
    		throw new Error("<Animate>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get layout() {
    		throw new Error("<Animate>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set layout(value) {
    		throw new Error("<Animate>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get safeToRemove() {
    		throw new Error("<Animate>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set safeToRemove(value) {
    		throw new Error("<Animate>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Animate$1 = Animate;

    /* node_modules\svelte-motion\src\motion\features\layout\AnimateLayoutContextProvider.svelte generated by Svelte v3.55.1 */

    function create_fragment$5(ctx) {
    	let animate;
    	let current;

    	animate = new Animate$1({
    			props: {
    				visualElement: /*visualElement*/ ctx[0],
    				layout: /*layout*/ ctx[1],
    				safeToRemove: /*$presence*/ ctx[2][1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(animate.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(animate, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const animate_changes = {};
    			if (dirty & /*visualElement*/ 1) animate_changes.visualElement = /*visualElement*/ ctx[0];
    			if (dirty & /*layout*/ 2) animate_changes.layout = /*layout*/ ctx[1];
    			if (dirty & /*$presence*/ 4) animate_changes.safeToRemove = /*$presence*/ ctx[2][1];
    			animate.$set(animate_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(animate.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(animate.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(animate, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $presence;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AnimateLayoutContextProvider', slots, []);
    	let { visualElement, props, isCustom } = $$props;
    	let { layout } = props;
    	const presence = usePresence(isCustom);
    	validate_store(presence, 'presence');
    	component_subscribe($$self, presence, value => $$invalidate(2, $presence = value));

    	$$self.$$.on_mount.push(function () {
    		if (visualElement === undefined && !('visualElement' in $$props || $$self.$$.bound[$$self.$$.props['visualElement']])) {
    			console.warn("<AnimateLayoutContextProvider> was created without expected prop 'visualElement'");
    		}

    		if (props === undefined && !('props' in $$props || $$self.$$.bound[$$self.$$.props['props']])) {
    			console.warn("<AnimateLayoutContextProvider> was created without expected prop 'props'");
    		}

    		if (isCustom === undefined && !('isCustom' in $$props || $$self.$$.bound[$$self.$$.props['isCustom']])) {
    			console.warn("<AnimateLayoutContextProvider> was created without expected prop 'isCustom'");
    		}
    	});

    	const writable_props = ['visualElement', 'props', 'isCustom'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AnimateLayoutContextProvider> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('visualElement' in $$props) $$invalidate(0, visualElement = $$props.visualElement);
    		if ('props' in $$props) $$invalidate(4, props = $$props.props);
    		if ('isCustom' in $$props) $$invalidate(5, isCustom = $$props.isCustom);
    	};

    	$$self.$capture_state = () => ({
    		usePresence,
    		Animate: Animate$1,
    		visualElement,
    		props,
    		isCustom,
    		layout,
    		presence,
    		$presence
    	});

    	$$self.$inject_state = $$props => {
    		if ('visualElement' in $$props) $$invalidate(0, visualElement = $$props.visualElement);
    		if ('props' in $$props) $$invalidate(4, props = $$props.props);
    		if ('isCustom' in $$props) $$invalidate(5, isCustom = $$props.isCustom);
    		if ('layout' in $$props) $$invalidate(1, layout = $$props.layout);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*props*/ 16) {
    			$$invalidate(1, { layout } = props, layout);
    		}
    	};

    	return [visualElement, layout, $presence, presence, props, isCustom];
    }

    class AnimateLayoutContextProvider extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { visualElement: 0, props: 4, isCustom: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AnimateLayoutContextProvider",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get visualElement() {
    		throw new Error("<AnimateLayoutContextProvider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set visualElement(value) {
    		throw new Error("<AnimateLayoutContextProvider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get props() {
    		throw new Error("<AnimateLayoutContextProvider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set props(value) {
    		throw new Error("<AnimateLayoutContextProvider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isCustom() {
    		throw new Error("<AnimateLayoutContextProvider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isCustom(value) {
    		throw new Error("<AnimateLayoutContextProvider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var AnimateLayoutContextProvider$1 = AnimateLayoutContextProvider;

    /* node_modules\svelte-motion\src\motion\features\layout\Measure.svelte generated by Svelte v3.55.1 */

    function create_fragment$4(ctx) {
    	const block = {
    		c: noop$1,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop$1,
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: noop$1
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Measure', slots, []);
    	let { visualElement, syncLayout, framerSyncLayout, update } = $$props;
    	const scaleCorrectionContext = getContext(ScaleCorrectionContext);
    	const scaleCorrectionParentContext = getContext(ScaleCorrectionParentContext);

    	onMount(() => {
    		isSharedLayout(syncLayout) && syncLayout.register(visualElement);
    		isSharedLayout(framerSyncLayout) && framerSyncLayout.register(visualElement);

    		visualElement.onUnmount(() => {
    			if (isSharedLayout(syncLayout)) {
    				syncLayout.remove(visualElement);
    			}

    			if (isSharedLayout(framerSyncLayout)) {
    				framerSyncLayout.remove(visualElement);
    			}
    		});
    	});

    	/**
     * If this is a child of a SyncContext, notify it that it needs to re-render. It will then
     * handle the snapshotting.
     *
     * If it is stand-alone component, add it to the batcher.
     */
    	let updated = false;

    	const updater = (nc = false) => {
    		if (updated) {
    			return null;
    		}

    		updated = true;

    		// in React the updater function is called on children first, in Svelte the child does not call it.
    		get_store_value(scaleCorrectionContext).forEach(v => {
    			v.updater?.(true);
    		});

    		if (isSharedLayout(syncLayout)) {
    			syncLayout.syncUpdate();
    		} else {
    			snapshotViewportBox(visualElement, nc);
    			syncLayout.add(visualElement);
    		}

    		return null;
    	};

    	if (update === undefined) {
    		beforeUpdate(updater);
    	}

    	const afterU = (nc = false) => {
    		updated = false;

    		/* Second part of the updater calling in child layouts first.*/
    		const scc = get_store_value(scaleCorrectionContext);

    		scc.forEach((v, i) => {
    			v.afterU?.(true);
    		});

    		if (!isSharedLayout(syncLayout)) {
    			syncLayout.flush();
    		}
    	}; /**
     * If this axis isn't animating as a result of this render we want to reset the targetBox
     * to the measured box
     */ //setCurrentViewportBox(visualElement);

    	scaleCorrectionParentContext.update(v => v.concat([{ updater, afterU }]));
    	afterUpdate(afterU);

    	$$self.$$.on_mount.push(function () {
    		if (visualElement === undefined && !('visualElement' in $$props || $$self.$$.bound[$$self.$$.props['visualElement']])) {
    			console.warn("<Measure> was created without expected prop 'visualElement'");
    		}

    		if (syncLayout === undefined && !('syncLayout' in $$props || $$self.$$.bound[$$self.$$.props['syncLayout']])) {
    			console.warn("<Measure> was created without expected prop 'syncLayout'");
    		}

    		if (framerSyncLayout === undefined && !('framerSyncLayout' in $$props || $$self.$$.bound[$$self.$$.props['framerSyncLayout']])) {
    			console.warn("<Measure> was created without expected prop 'framerSyncLayout'");
    		}

    		if (update === undefined && !('update' in $$props || $$self.$$.bound[$$self.$$.props['update']])) {
    			console.warn("<Measure> was created without expected prop 'update'");
    		}
    	});

    	const writable_props = ['visualElement', 'syncLayout', 'framerSyncLayout', 'update'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Measure> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('visualElement' in $$props) $$invalidate(0, visualElement = $$props.visualElement);
    		if ('syncLayout' in $$props) $$invalidate(1, syncLayout = $$props.syncLayout);
    		if ('framerSyncLayout' in $$props) $$invalidate(2, framerSyncLayout = $$props.framerSyncLayout);
    		if ('update' in $$props) $$invalidate(3, update = $$props.update);
    	};

    	$$self.$capture_state = () => ({
    		afterUpdate,
    		beforeUpdate,
    		getContext,
    		onMount,
    		get: get_store_value,
    		ScaleCorrectionContext,
    		ScaleCorrectionParentContext,
    		isSharedLayout,
    		snapshotViewportBox,
    		visualElement,
    		syncLayout,
    		framerSyncLayout,
    		update,
    		scaleCorrectionContext,
    		scaleCorrectionParentContext,
    		updated,
    		updater,
    		afterU
    	});

    	$$self.$inject_state = $$props => {
    		if ('visualElement' in $$props) $$invalidate(0, visualElement = $$props.visualElement);
    		if ('syncLayout' in $$props) $$invalidate(1, syncLayout = $$props.syncLayout);
    		if ('framerSyncLayout' in $$props) $$invalidate(2, framerSyncLayout = $$props.framerSyncLayout);
    		if ('update' in $$props) $$invalidate(3, update = $$props.update);
    		if ('updated' in $$props) updated = $$props.updated;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*update*/ 8) {
    			update !== undefined && updater(update);
    		}
    	};

    	return [visualElement, syncLayout, framerSyncLayout, update];
    }

    class Measure extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			visualElement: 0,
    			syncLayout: 1,
    			framerSyncLayout: 2,
    			update: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Measure",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get visualElement() {
    		throw new Error("<Measure>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set visualElement(value) {
    		throw new Error("<Measure>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get syncLayout() {
    		throw new Error("<Measure>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set syncLayout(value) {
    		throw new Error("<Measure>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get framerSyncLayout() {
    		throw new Error("<Measure>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set framerSyncLayout(value) {
    		throw new Error("<Measure>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get update() {
    		throw new Error("<Measure>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set update(value) {
    		throw new Error("<Measure>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Measure$1 = Measure;

    /* node_modules\svelte-motion\src\motion\features\layout\MeasureContextProvider.svelte generated by Svelte v3.55.1 */

    function create_fragment$3(ctx) {
    	let measure;
    	let current;

    	measure = new Measure$1({
    			props: {
    				syncLayout: /*$syncLayout*/ ctx[2],
    				framerSyncLayout: /*$framerSyncLayout*/ ctx[3],
    				visualElement: /*visualElement*/ ctx[0],
    				update: /*update*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(measure.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(measure, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const measure_changes = {};
    			if (dirty & /*$syncLayout*/ 4) measure_changes.syncLayout = /*$syncLayout*/ ctx[2];
    			if (dirty & /*$framerSyncLayout*/ 8) measure_changes.framerSyncLayout = /*$framerSyncLayout*/ ctx[3];
    			if (dirty & /*visualElement*/ 1) measure_changes.visualElement = /*visualElement*/ ctx[0];
    			if (dirty & /*update*/ 2) measure_changes.update = /*update*/ ctx[1];
    			measure.$set(measure_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(measure.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(measure.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(measure, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let update;
    	let $syncLayout;
    	let $framerSyncLayout;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MeasureContextProvider', slots, []);
    	let { visualElement, props, isCustom } = $$props;
    	const syncLayout = getContext(SharedLayoutContext) || SharedLayoutContext(isCustom);
    	validate_store(syncLayout, 'syncLayout');
    	component_subscribe($$self, syncLayout, value => $$invalidate(2, $syncLayout = value));
    	const framerSyncLayout = getContext(FramerTreeLayoutContext) || FramerTreeLayoutContext();
    	validate_store(framerSyncLayout, 'framerSyncLayout');
    	component_subscribe($$self, framerSyncLayout, value => $$invalidate(3, $framerSyncLayout = value));

    	$$self.$$.on_mount.push(function () {
    		if (visualElement === undefined && !('visualElement' in $$props || $$self.$$.bound[$$self.$$.props['visualElement']])) {
    			console.warn("<MeasureContextProvider> was created without expected prop 'visualElement'");
    		}

    		if (props === undefined && !('props' in $$props || $$self.$$.bound[$$self.$$.props['props']])) {
    			console.warn("<MeasureContextProvider> was created without expected prop 'props'");
    		}

    		if (isCustom === undefined && !('isCustom' in $$props || $$self.$$.bound[$$self.$$.props['isCustom']])) {
    			console.warn("<MeasureContextProvider> was created without expected prop 'isCustom'");
    		}
    	});

    	const writable_props = ['visualElement', 'props', 'isCustom'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MeasureContextProvider> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('visualElement' in $$props) $$invalidate(0, visualElement = $$props.visualElement);
    		if ('props' in $$props) $$invalidate(6, props = $$props.props);
    		if ('isCustom' in $$props) $$invalidate(7, isCustom = $$props.isCustom);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		SharedLayoutContext,
    		FramerTreeLayoutContext,
    		Measure: Measure$1,
    		visualElement,
    		props,
    		isCustom,
    		syncLayout,
    		framerSyncLayout,
    		update,
    		$syncLayout,
    		$framerSyncLayout
    	});

    	$$self.$inject_state = $$props => {
    		if ('visualElement' in $$props) $$invalidate(0, visualElement = $$props.visualElement);
    		if ('props' in $$props) $$invalidate(6, props = $$props.props);
    		if ('isCustom' in $$props) $$invalidate(7, isCustom = $$props.isCustom);
    		if ('update' in $$props) $$invalidate(1, update = $$props.update);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*props*/ 64) {
    			$$invalidate(1, { update } = props, update);
    		}
    	};

    	return [
    		visualElement,
    		update,
    		$syncLayout,
    		$framerSyncLayout,
    		syncLayout,
    		framerSyncLayout,
    		props,
    		isCustom
    	];
    }

    class MeasureContextProvider extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { visualElement: 0, props: 6, isCustom: 7 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MeasureContextProvider",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get visualElement() {
    		throw new Error("<MeasureContextProvider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set visualElement(value) {
    		throw new Error("<MeasureContextProvider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get props() {
    		throw new Error("<MeasureContextProvider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set props(value) {
    		throw new Error("<MeasureContextProvider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isCustom() {
    		throw new Error("<MeasureContextProvider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isCustom(value) {
    		throw new Error("<MeasureContextProvider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var MeasureContextProvider$1 = MeasureContextProvider;

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    var layoutAnimations = {
        measureLayout: MeasureContextProvider$1,
        layoutAnimation: AnimateLayoutContextProvider$1
    };

    /* node_modules\svelte-motion\src\motion\features\AnimationState.svelte generated by Svelte v3.55.1 */

    function create_fragment$2(ctx) {
    	const block = {
    		c: noop$1,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop$1,
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: noop$1
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AnimationState', slots, []);
    	let { visualElement, props } = $$props;
    	let { animate } = props;

    	$$self.$$.on_mount.push(function () {
    		if (visualElement === undefined && !('visualElement' in $$props || $$self.$$.bound[$$self.$$.props['visualElement']])) {
    			console.warn("<AnimationState> was created without expected prop 'visualElement'");
    		}

    		if (props === undefined && !('props' in $$props || $$self.$$.bound[$$self.$$.props['props']])) {
    			console.warn("<AnimationState> was created without expected prop 'props'");
    		}
    	});

    	const writable_props = ['visualElement', 'props'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AnimationState> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('visualElement' in $$props) $$invalidate(0, visualElement = $$props.visualElement);
    		if ('props' in $$props) $$invalidate(1, props = $$props.props);
    	};

    	$$self.$capture_state = () => ({
    		tick,
    		createAnimationState,
    		isAnimationControls,
    		visualElement,
    		props,
    		animate
    	});

    	$$self.$inject_state = $$props => {
    		if ('visualElement' in $$props) $$invalidate(0, visualElement = $$props.visualElement);
    		if ('props' in $$props) $$invalidate(1, props = $$props.props);
    		if ('animate' in $$props) $$invalidate(2, animate = $$props.animate);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*props*/ 2) {
    			$$invalidate(2, { animate } = props, animate);
    		}

    		if ($$self.$$.dirty & /*visualElement*/ 1) {
    			/**
     * We dynamically generate the AnimationState manager as it contains a reference
     * to the underlying animation library. We only want to load that if we load this,
     * so people can optionally code split it out using the `m` component.
     */
    			{
    				$$invalidate(0, visualElement.animationState = visualElement.animationState || createAnimationState(visualElement), visualElement);
    			}
    		}

    		if ($$self.$$.dirty & /*animate, visualElement*/ 5) {
    			/**
     * Subscribe any provided AnimationControls to the component's VisualElement
     */
    			if (isAnimationControls(animate)) {
    				tick().then(() => animate.subscribe(visualElement)); /*, [animate]*/
    			}
    		}
    	};

    	return [visualElement, props, animate];
    }

    class AnimationState extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { visualElement: 0, props: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AnimationState",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get visualElement() {
    		throw new Error("<AnimationState>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set visualElement(value) {
    		throw new Error("<AnimationState>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get props() {
    		throw new Error("<AnimationState>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set props(value) {
    		throw new Error("<AnimationState>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var AnimationState$1 = AnimationState;

    /* node_modules\svelte-motion\src\motion\features\Exit.svelte generated by Svelte v3.55.1 */

    function create_fragment$1(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 64)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[6],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[6], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let custom;
    	let $presence;
    	let $presenceContext;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Exit', slots, ['default']);
    	let { props, visualElement, isCustom } = $$props;
    	const presenceContext = getContext(PresenceContext) || PresenceContext(isCustom);
    	validate_store(presenceContext, 'presenceContext');
    	component_subscribe($$self, presenceContext, value => $$invalidate(9, $presenceContext = value));
    	const presence = usePresence(isCustom);
    	validate_store(presence, 'presence');
    	component_subscribe($$self, presence, value => $$invalidate(5, $presence = value));

    	const effect = pres => {
    		const [isPresent, onExitComplete] = pres;

    		const animation = visualElement.animationState?.setActive(AnimationType.Exit, !isPresent, {
    			custom: $presenceContext?.custom ?? custom
    		});

    		!isPresent && animation?.then(onExitComplete);
    		return "";
    	};

    	$$self.$$.on_mount.push(function () {
    		if (props === undefined && !('props' in $$props || $$self.$$.bound[$$self.$$.props['props']])) {
    			console.warn("<Exit> was created without expected prop 'props'");
    		}

    		if (visualElement === undefined && !('visualElement' in $$props || $$self.$$.bound[$$self.$$.props['visualElement']])) {
    			console.warn("<Exit> was created without expected prop 'visualElement'");
    		}

    		if (isCustom === undefined && !('isCustom' in $$props || $$self.$$.bound[$$self.$$.props['isCustom']])) {
    			console.warn("<Exit> was created without expected prop 'isCustom'");
    		}
    	});

    	const writable_props = ['props', 'visualElement', 'isCustom'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Exit> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('props' in $$props) $$invalidate(2, props = $$props.props);
    		if ('visualElement' in $$props) $$invalidate(3, visualElement = $$props.visualElement);
    		if ('isCustom' in $$props) $$invalidate(4, isCustom = $$props.isCustom);
    		if ('$$scope' in $$props) $$invalidate(6, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		usePresence,
    		getContext,
    		PresenceContext,
    		AnimationType,
    		props,
    		visualElement,
    		isCustom,
    		presenceContext,
    		presence,
    		effect,
    		custom,
    		$presence,
    		$presenceContext
    	});

    	$$self.$inject_state = $$props => {
    		if ('props' in $$props) $$invalidate(2, props = $$props.props);
    		if ('visualElement' in $$props) $$invalidate(3, visualElement = $$props.visualElement);
    		if ('isCustom' in $$props) $$invalidate(4, isCustom = $$props.isCustom);
    		if ('custom' in $$props) custom = $$props.custom;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*props*/ 4) {
    			({ custom } = props);
    		}

    		if ($$self.$$.dirty & /*$presence*/ 32) {
    			effect($presence);
    		}
    	};

    	return [
    		presenceContext,
    		presence,
    		props,
    		visualElement,
    		isCustom,
    		$presence,
    		$$scope,
    		slots
    	];
    }

    class Exit extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { props: 2, visualElement: 3, isCustom: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Exit",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get props() {
    		throw new Error("<Exit>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set props(value) {
    		throw new Error("<Exit>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get visualElement() {
    		throw new Error("<Exit>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set visualElement(value) {
    		throw new Error("<Exit>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isCustom() {
    		throw new Error("<Exit>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isCustom(value) {
    		throw new Error("<Exit>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Exit$1 = Exit;

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */
    /**
     * @public
     */
    const animations = {
        animation: AnimationState$1,
        exit:Exit$1
    };

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */

    const featureBundle = {
        ...animations,
        ...gestureAnimations,
        ...drag,
        ...layoutAnimations,
    };

    /** 
    based on framer-motion@4.0.3,
    Copyright (c) 2018 Framer B.V.
    */
    //import { createMotionProxy } from './motion-proxy.js';



    /**
     * HTML & SVG components, optimised for use with gestures and animation. These can be used as
     * drop-in replacements for any HTML & SVG component, all CSS & SVG properties are supported.
     *
     * @public
     */
    var motion = /*@__PURE__*/ //createMotionProxy(allMotionFeatures);
        createMotionClass(featureBundle);

    /* src\App.svelte generated by Svelte v3.55.1 */
    const file = "src\\App.svelte";

    // (14:0) {#if animate}
    function create_if_block(ctx) {
    	let main;
    	let div0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let div1;
    	let img1;
    	let img1_src_value;
    	let t1;
    	let div3;
    	let div2;
    	let img2;
    	let img2_src_value;
    	let t2;
    	let img3;
    	let img3_src_value;
    	let t3;
    	let img4;
    	let img4_src_value;
    	let t4;
    	let img5;
    	let img5_src_value;
    	let t5;
    	let img6;
    	let img6_src_value;
    	let t6;
    	let h10;
    	let t8;
    	let p0;
    	let t10;
    	let div4;
    	let img7;
    	let img7_src_value;
    	let t11;
    	let img8;
    	let img8_src_value;
    	let t12;
    	let div5;
    	let img9;
    	let img9_src_value;
    	let t13;
    	let h11;
    	let t15;
    	let img10;
    	let img10_src_value;
    	let t16;
    	let img11;
    	let img11_src_value;
    	let t17;
    	let div6;
    	let img12;
    	let img12_src_value;
    	let t18;
    	let img13;
    	let img13_src_value;
    	let t19;
    	let p1;
    	let t21;
    	let footer;
    	let main_intro;

    	const block = {
    		c: function create() {
    			main = element("main");
    			div0 = element("div");
    			img0 = element("img");
    			t0 = space();
    			div1 = element("div");
    			img1 = element("img");
    			t1 = space();
    			div3 = element("div");
    			div2 = element("div");
    			img2 = element("img");
    			t2 = space();
    			img3 = element("img");
    			t3 = space();
    			img4 = element("img");
    			t4 = space();
    			img5 = element("img");
    			t5 = space();
    			img6 = element("img");
    			t6 = space();
    			h10 = element("h1");
    			h10.textContent = "Kausthub's studio";
    			t8 = space();
    			p0 = element("p");
    			p0.textContent = "Web and Ai Developer";
    			t10 = space();
    			div4 = element("div");
    			img7 = element("img");
    			t11 = space();
    			img8 = element("img");
    			t12 = space();
    			div5 = element("div");
    			img9 = element("img");
    			t13 = space();
    			h11 = element("h1");
    			h11.textContent = "Automate Your Products using AI";
    			t15 = space();
    			img10 = element("img");
    			t16 = space();
    			img11 = element("img");
    			t17 = space();
    			div6 = element("div");
    			img12 = element("img");
    			t18 = space();
    			img13 = element("img");
    			t19 = space();
    			p1 = element("p");
    			p1.textContent = "Design confident, user appealing applications OWO";
    			t21 = space();
    			footer = element("footer");
    			footer.textContent = "Copyrights reserved @ 2023";
    			attr_dev(img0, "class", "wave svelte-tg45m4");
    			if (!src_url_equal(img0.src, img0_src_value = "wave.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "");
    			add_location(img0, file, 16, 2, 321);
    			attr_dev(div0, "class", "navbar");
    			add_location(div0, file, 15, 1, 298);
    			attr_dev(img1, "class", "logo svelte-tg45m4");
    			if (!src_url_equal(img1.src, img1_src_value = "images/avatar.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "");
    			add_location(img1, file, 19, 3, 382);
    			add_location(div1, file, 18, 2, 373);
    			set_style(img2, "width", "14%");
    			attr_dev(img2, "alt", "");
    			if (!src_url_equal(img2.src, img2_src_value = "icons/tech/mongodb.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "class", "svelte-tg45m4");
    			add_location(img2, file, 23, 3, 494);
    			set_style(img3, "width", "13%");
    			attr_dev(img3, "alt", "");
    			if (!src_url_equal(img3.src, img3_src_value = "icons/tech/nodejs.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "class", "svelte-tg45m4");
    			add_location(img3, file, 24, 3, 559);
    			set_style(img4, "width", "13%");
    			attr_dev(img4, "alt", "");
    			if (!src_url_equal(img4.src, img4_src_value = "icons/tech/react.png")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "class", "svelte-tg45m4");
    			add_location(img4, file, 25, 3, 623);
    			set_style(img5, "width", "13%");
    			attr_dev(img5, "alt", "");
    			if (!src_url_equal(img5.src, img5_src_value = "icons/tech/tensorflow.png")) attr_dev(img5, "src", img5_src_value);
    			attr_dev(img5, "class", "svelte-tg45m4");
    			add_location(img5, file, 26, 3, 686);
    			set_style(img6, "width", "23%");
    			attr_dev(img6, "alt", "");
    			if (!src_url_equal(img6.src, img6_src_value = "icons/tech/sveltejs.png")) attr_dev(img6, "src", img6_src_value);
    			attr_dev(img6, "class", "svelte-tg45m4");
    			add_location(img6, file, 27, 3, 754);
    			attr_dev(div2, "class", "icon-tech svelte-tg45m4");
    			add_location(div2, file, 22, 2, 467);
    			attr_dev(h10, "class", "svelte-tg45m4");
    			add_location(h10, file, 29, 2, 828);
    			attr_dev(p0, "class", "svelte-tg45m4");
    			add_location(p0, file, 30, 2, 857);
    			attr_dev(div3, "class", "content svelte-tg45m4");
    			add_location(div3, file, 21, 1, 443);
    			set_style(img7, "width", "14%");
    			attr_dev(img7, "alt", "");
    			if (!src_url_equal(img7.src, img7_src_value = "icons/github.png")) attr_dev(img7, "src", img7_src_value);
    			attr_dev(img7, "class", "svelte-tg45m4");
    			add_location(img7, file, 33, 2, 922);
    			set_style(img8, "width", "13%");
    			attr_dev(img8, "alt", "");
    			if (!src_url_equal(img8.src, img8_src_value = "icons/linkedin.png")) attr_dev(img8, "src", img8_src_value);
    			attr_dev(img8, "class", "svelte-tg45m4");
    			add_location(img8, file, 34, 2, 980);
    			attr_dev(div4, "class", "media-icons svelte-tg45m4");
    			add_location(div4, file, 32, 1, 894);
    			attr_dev(img9, "id", "curve");
    			if (!src_url_equal(img9.src, img9_src_value = /*curve*/ ctx[1])) attr_dev(img9, "src", img9_src_value);
    			attr_dev(img9, "alt", "");
    			attr_dev(img9, "class", "svelte-tg45m4");
    			add_location(img9, file, 38, 2, 1078);
    			attr_dev(h11, "class", "headings svelte-tg45m4");
    			add_location(h11, file, 39, 2, 1118);
    			attr_dev(img10, "class", "cat svelte-tg45m4");
    			attr_dev(img10, "alt", "");
    			if (!src_url_equal(img10.src, img10_src_value = "casualCat.png")) attr_dev(img10, "src", img10_src_value);
    			add_location(img10, file, 40, 2, 1178);
    			attr_dev(img11, "id", "mac-screen");
    			if (!src_url_equal(img11.src, img11_src_value = "images/mac.png")) attr_dev(img11, "src", img11_src_value);
    			attr_dev(img11, "alt", "");
    			attr_dev(img11, "class", "svelte-tg45m4");
    			add_location(img11, file, 41, 2, 1227);
    			attr_dev(div5, "class", "skill-content");
    			add_location(div5, file, 37, 1, 1048);
    			attr_dev(img12, "id", "curve");
    			if (!src_url_equal(img12.src, img12_src_value = "curve2.png")) attr_dev(img12, "src", img12_src_value);
    			attr_dev(img12, "alt", "");
    			attr_dev(img12, "class", "svelte-tg45m4");
    			add_location(img12, file, 45, 2, 1318);
    			attr_dev(img13, "class", "cat2 svelte-tg45m4");
    			attr_dev(img13, "alt", "");
    			if (!src_url_equal(img13.src, img13_src_value = "backCat.png")) attr_dev(img13, "src", img13_src_value);
    			add_location(img13, file, 46, 2, 1363);
    			attr_dev(p1, "class", "content2 svelte-tg45m4");
    			add_location(p1, file, 47, 2, 1411);
    			attr_dev(div6, "class", "skill-content");
    			add_location(div6, file, 44, 1, 1288);
    			attr_dev(footer, "class", "svelte-tg45m4");
    			add_location(footer, file, 50, 1, 1495);
    			add_location(main, file, 14, 0, 264);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div0);
    			append_dev(div0, img0);
    			append_dev(main, t0);
    			append_dev(main, div1);
    			append_dev(div1, img1);
    			append_dev(main, t1);
    			append_dev(main, div3);
    			append_dev(div3, div2);
    			append_dev(div2, img2);
    			append_dev(div2, t2);
    			append_dev(div2, img3);
    			append_dev(div2, t3);
    			append_dev(div2, img4);
    			append_dev(div2, t4);
    			append_dev(div2, img5);
    			append_dev(div2, t5);
    			append_dev(div2, img6);
    			append_dev(div3, t6);
    			append_dev(div3, h10);
    			append_dev(div3, t8);
    			append_dev(div3, p0);
    			append_dev(main, t10);
    			append_dev(main, div4);
    			append_dev(div4, img7);
    			append_dev(div4, t11);
    			append_dev(div4, img8);
    			append_dev(main, t12);
    			append_dev(main, div5);
    			append_dev(div5, img9);
    			append_dev(div5, t13);
    			append_dev(div5, h11);
    			append_dev(div5, t15);
    			append_dev(div5, img10);
    			append_dev(div5, t16);
    			append_dev(div5, img11);
    			append_dev(main, t17);
    			append_dev(main, div6);
    			append_dev(div6, img12);
    			append_dev(div6, t18);
    			append_dev(div6, img13);
    			append_dev(div6, t19);
    			append_dev(div6, p1);
    			append_dev(main, t21);
    			append_dev(main, footer);
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (!main_intro) {
    				add_render_callback(() => {
    					main_intro = create_in_transition(main, fade, { duration: 1000 });
    					main_intro.start();
    				});
    			}
    		},
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(14:0) {#if animate}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let if_block_anchor;
    	let if_block = /*animate*/ ctx[0] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*animate*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*animate*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: function intro(local) {
    			transition_in(if_block);
    		},
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let i = 0;
    	let animate = false;
    	let curve = "curve1.png";

    	onMount(() => {
    		$$invalidate(0, animate = true);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		fade,
    		slide,
    		Motion: motion,
    		i,
    		animate,
    		curve
    	});

    	$$self.$inject_state = $$props => {
    		if ('i' in $$props) i = $$props.i;
    		if ('animate' in $$props) $$invalidate(0, animate = $$props.animate);
    		if ('curve' in $$props) $$invalidate(1, curve = $$props.curve);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [animate, curve];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
