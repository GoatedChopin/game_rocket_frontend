
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
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
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
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
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

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
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
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
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function self(fn) {
        return function (event) {
            // @ts-ignore
            if (event.target === this)
                fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_svg_attributes(node, attributes) {
        for (const key in attributes) {
            attr(node, key, attributes[key]);
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }
    class HtmlTag {
        constructor(is_svg = false) {
            this.is_svg = false;
            this.is_svg = is_svg;
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                if (this.is_svg)
                    this.e = svg_element(target.nodeName);
                else
                    this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
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
     * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
     * Event dispatchers are functions that can take two arguments: `name` and `detail`.
     *
     * Component events created with `createEventDispatcher` create a
     * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
     * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
     * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
     * property and can contain any type of data.
     *
     * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
     */
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
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
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
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
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
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
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
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
                    config = config();
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
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
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

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
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
            update: noop,
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
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.53.1' }, detail), { bubbles: true }));
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
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
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

    /* src/components/Card.svelte generated by Svelte v3.53.1 */

    const file$c = "src/components/Card.svelte";

    function create_fragment$c(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "card svelte-szlh9f");
    			add_location(div, file$c, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
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
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
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

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Card', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Card> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src/components/Title.svelte generated by Svelte v3.53.1 */
    const file$b = "src/components/Title.svelte";

    // (7:0) <Card>
    function create_default_slot$3(ctx) {
    	let header;
    	let h1;
    	let t1;
    	let h2;

    	const block = {
    		c: function create() {
    			header = element("header");
    			h1 = element("h1");
    			h1.textContent = "Game Rocket";
    			t1 = space();
    			h2 = element("h2");
    			h2.textContent = "A crowdsourced recommendation engine for video games";
    			attr_dev(h1, "class", "svelte-1ycqh3z");
    			add_location(h1, file$b, 8, 8, 96);
    			attr_dev(h2, "class", "svelte-1ycqh3z");
    			add_location(h2, file$b, 11, 8, 150);
    			attr_dev(header, "class", "svelte-1ycqh3z");
    			add_location(header, file$b, 7, 4, 78);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, h1);
    			append_dev(header, t1);
    			append_dev(header, h2);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(7:0) <Card>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let card;
    	let current;

    	card = new Card({
    			props: {
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const card_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				card_changes.$$scope = { dirty, ctx };
    			}

    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Title', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Title> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Card });
    	return [];
    }

    class Title extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Title",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src/components/AboutUs.svelte generated by Svelte v3.53.1 */
    const file$a = "src/components/AboutUs.svelte";

    // (19:4) {#if visible}
    function create_if_block$1(ctx) {
    	let p0;
    	let t1;
    	let br0;
    	let t2;
    	let p1;
    	let t4;
    	let br1;
    	let t5;
    	let p2;
    	let t7;
    	let br2;
    	let t8;
    	let p3;

    	const block = {
    		c: function create() {
    			p0 = element("p");
    			p0.textContent = "Game Rocket is a game recommendation algorithm constructed using natural language Processing with Spacy (Python) and 42,000 Steam reviews across 5,000 games.";
    			t1 = space();
    			br0 = element("br");
    			t2 = space();
    			p1 = element("p");
    			p1.textContent = "Each review has been analyzed for similarity with 51 separate descriptors and features commonly used to talk about games.";
    			t4 = space();
    			br1 = element("br");
    			t5 = space();
    			p2 = element("p");
    			p2.textContent = "Using sentiment analysis from Vader (Python), the satisfaction of each reviewer in each review has been approximated.";
    			t7 = space();
    			br2 = element("br");
    			t8 = space();
    			p3 = element("p");
    			p3.textContent = "In short, Game Rocket uses machine learning to help users find games that match their preferences.";
    			attr_dev(p0, "class", "svelte-1f4bsnv");
    			add_location(p0, file$a, 19, 8, 418);
    			add_location(br0, file$a, 22, 8, 617);
    			attr_dev(p1, "class", "svelte-1f4bsnv");
    			add_location(p1, file$a, 23, 8, 631);
    			add_location(br1, file$a, 26, 8, 794);
    			attr_dev(p2, "class", "svelte-1f4bsnv");
    			add_location(p2, file$a, 27, 8, 808);
    			add_location(br2, file$a, 30, 8, 966);
    			attr_dev(p3, "class", "svelte-1f4bsnv");
    			add_location(p3, file$a, 31, 8, 980);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p1, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, p2, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, br2, anchor);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, p3, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(p2);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(br2);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(p3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(19:4) {#if visible}",
    		ctx
    	});

    	return block;
    }

    // (10:0) <Card>
    function create_default_slot$2(ctx) {
    	let header;
    	let h2;
    	let button;
    	let p;
    	let t1;
    	let if_block_anchor;
    	let mounted;
    	let dispose;
    	let if_block = /*visible*/ ctx[0] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			header = element("header");
    			h2 = element("h2");
    			button = element("button");
    			p = element("p");
    			p.textContent = "About Game Rocket";
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(p, "class", "svelte-1f4bsnv");
    			add_location(p, file$a, 13, 16, 310);
    			attr_dev(button, "class", "svelte-1f4bsnv");
    			add_location(button, file$a, 12, 12, 261);
    			attr_dev(h2, "class", "svelte-1f4bsnv");
    			add_location(h2, file$a, 11, 8, 243);
    			attr_dev(header, "class", "svelte-1f4bsnv");
    			add_location(header, file$a, 10, 4, 225);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, h2);
    			append_dev(h2, button);
    			append_dev(button, p);
    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*toggleAbout*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*visible*/ ctx[0]) {
    				if (if_block) ; else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(10:0) <Card>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let card;
    	let current;

    	card = new Card({
    			props: {
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const card_changes = {};

    			if (dirty & /*$$scope, visible*/ 5) {
    				card_changes.$$scope = { dirty, ctx };
    			}

    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AboutUs', slots, []);
    	let visible = false;

    	function toggleAbout() {
    		$$invalidate(0, visible = !visible);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AboutUs> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		get_all_dirty_from_scope,
    		Card,
    		visible,
    		toggleAbout
    	});

    	$$self.$inject_state = $$props => {
    		if ('visible' in $$props) $$invalidate(0, visible = $$props.visible);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [visible, toggleAbout];
    }

    class AboutUs extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AboutUs",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* node_modules/svelte-multiselect/CircleSpinner.svelte generated by Svelte v3.53.1 */

    const file$9 = "node_modules/svelte-multiselect/CircleSpinner.svelte";

    function create_fragment$9(ctx) {
    	let div;

    	let style_border_color = `${/*color*/ ctx[0]} transparent ${/*color*/ ctx[0]}
  ${/*color*/ ctx[0]}`;

    	const block = {
    		c: function create() {
    			div = element("div");
    			set_style(div, "--duration", /*duration*/ ctx[1]);
    			attr_dev(div, "class", "svelte-66wdl1");
    			set_style(div, "border-color", style_border_color);
    			set_style(div, "width", /*size*/ ctx[2]);
    			set_style(div, "height", /*size*/ ctx[2]);
    			add_location(div, file$9, 5, 0, 111);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*duration*/ 2) {
    				set_style(div, "--duration", /*duration*/ ctx[1]);
    			}

    			if (dirty & /*color*/ 1 && style_border_color !== (style_border_color = `${/*color*/ ctx[0]} transparent ${/*color*/ ctx[0]}
  ${/*color*/ ctx[0]}`)) {
    				set_style(div, "border-color", style_border_color);
    			}

    			if (dirty & /*size*/ 4) {
    				set_style(div, "width", /*size*/ ctx[2]);
    			}

    			if (dirty & /*size*/ 4) {
    				set_style(div, "height", /*size*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
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

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CircleSpinner', slots, []);
    	let { color = `cornflowerblue` } = $$props;
    	let { duration = `1.5s` } = $$props;
    	let { size = `1em` } = $$props;
    	const writable_props = ['color', 'duration', 'size'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CircleSpinner> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('duration' in $$props) $$invalidate(1, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(2, size = $$props.size);
    	};

    	$$self.$capture_state = () => ({ color, duration, size });

    	$$self.$inject_state = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('duration' in $$props) $$invalidate(1, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(2, size = $$props.size);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [color, duration, size];
    }

    class CircleSpinner extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { color: 0, duration: 1, size: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CircleSpinner",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get color() {
    		throw new Error("<CircleSpinner>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<CircleSpinner>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<CircleSpinner>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<CircleSpinner>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<CircleSpinner>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<CircleSpinner>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-multiselect/icons/ChevronExpand.svelte generated by Svelte v3.53.1 */

    const file$8 = "node_modules/svelte-multiselect/icons/ChevronExpand.svelte";

    function create_fragment$8(ctx) {
    	let svg;
    	let path;
    	let svg_levels = [/*$$props*/ ctx[0], { fill: "currentColor" }, { viewBox: "0 0 16 16" }];
    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z");
    			add_location(path, file$8, 1, 2, 61);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$8, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				dirty & /*$$props*/ 1 && /*$$props*/ ctx[0],
    				{ fill: "currentColor" },
    				{ viewBox: "0 0 16 16" }
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ChevronExpand', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class ChevronExpand extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChevronExpand",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* node_modules/svelte-multiselect/icons/Cross.svelte generated by Svelte v3.53.1 */

    const file$7 = "node_modules/svelte-multiselect/icons/Cross.svelte";

    function create_fragment$7(ctx) {
    	let svg;
    	let path;
    	let svg_levels = [/*$$props*/ ctx[0], { viewBox: "0 0 24 24" }, { fill: "currentColor" }];
    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59L7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12L5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z");
    			add_location(path, file$7, 1, 2, 61);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$7, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				dirty & /*$$props*/ 1 && /*$$props*/ ctx[0],
    				{ viewBox: "0 0 24 24" },
    				{ fill: "currentColor" }
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Cross', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class Cross extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Cross",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* node_modules/svelte-multiselect/icons/Disabled.svelte generated by Svelte v3.53.1 */

    const file$6 = "node_modules/svelte-multiselect/icons/Disabled.svelte";

    function create_fragment$6(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let svg_levels = [/*$$props*/ ctx[0], { viewBox: "0 0 24 24" }, { fill: "currentColor" }];
    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "fill", "none");
    			attr_dev(path0, "d", "M0 0h24v24H0V0z");
    			add_location(path0, file$6, 1, 2, 61);
    			attr_dev(path1, "d", "M14.48 11.95c.17.02.34.05.52.05 2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4c0 .18.03.35.05.52l3.43 3.43zm2.21 2.21L22.53 20H23v-2c0-2.14-3.56-3.5-6.31-3.84zM0 3.12l4 4V10H1v2h3v3h2v-3h2.88l2.51 2.51C9.19 15.11 7 16.3 7 18v2h9.88l4 4 1.41-1.41L1.41 1.71 0 3.12zM6.88 10H6v-.88l.88.88z");
    			add_location(path1, file$6, 2, 2, 104);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$6, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		p: function update(ctx, [dirty]) {
    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				dirty & /*$$props*/ 1 && /*$$props*/ ctx[0],
    				{ viewBox: "0 0 24 24" },
    				{ fill: "currentColor" }
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
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

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Disabled', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class Disabled extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Disabled",
    			options,
    			id: create_fragment$6.name
    		});
    	}
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
    function writable(value, start = noop) {
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
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
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

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function is_date(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function tick_spring(ctx, last_value, current_value, target_value) {
        if (typeof current_value === 'number' || is_date(current_value)) {
            // @ts-ignore
            const delta = target_value - current_value;
            // @ts-ignore
            const velocity = (current_value - last_value) / (ctx.dt || 1 / 60); // guard div by 0
            const spring = ctx.opts.stiffness * delta;
            const damper = ctx.opts.damping * velocity;
            const acceleration = (spring - damper) * ctx.inv_mass;
            const d = (velocity + acceleration) * ctx.dt;
            if (Math.abs(d) < ctx.opts.precision && Math.abs(delta) < ctx.opts.precision) {
                return target_value; // settled
            }
            else {
                ctx.settled = false; // signal loop to keep ticking
                // @ts-ignore
                return is_date(current_value) ?
                    new Date(current_value.getTime() + d) : current_value + d;
            }
        }
        else if (Array.isArray(current_value)) {
            // @ts-ignore
            return current_value.map((_, i) => tick_spring(ctx, last_value[i], current_value[i], target_value[i]));
        }
        else if (typeof current_value === 'object') {
            const next_value = {};
            for (const k in current_value) {
                // @ts-ignore
                next_value[k] = tick_spring(ctx, last_value[k], current_value[k], target_value[k]);
            }
            // @ts-ignore
            return next_value;
        }
        else {
            throw new Error(`Cannot spring ${typeof current_value} values`);
        }
    }
    function spring(value, opts = {}) {
        const store = writable(value);
        const { stiffness = 0.15, damping = 0.8, precision = 0.01 } = opts;
        let last_time;
        let task;
        let current_token;
        let last_value = value;
        let target_value = value;
        let inv_mass = 1;
        let inv_mass_recovery_rate = 0;
        let cancel_task = false;
        function set(new_value, opts = {}) {
            target_value = new_value;
            const token = current_token = {};
            if (value == null || opts.hard || (spring.stiffness >= 1 && spring.damping >= 1)) {
                cancel_task = true; // cancel any running animation
                last_time = now();
                last_value = new_value;
                store.set(value = target_value);
                return Promise.resolve();
            }
            else if (opts.soft) {
                const rate = opts.soft === true ? .5 : +opts.soft;
                inv_mass_recovery_rate = 1 / (rate * 60);
                inv_mass = 0; // infinite mass, unaffected by spring forces
            }
            if (!task) {
                last_time = now();
                cancel_task = false;
                task = loop(now => {
                    if (cancel_task) {
                        cancel_task = false;
                        task = null;
                        return false;
                    }
                    inv_mass = Math.min(inv_mass + inv_mass_recovery_rate, 1);
                    const ctx = {
                        inv_mass,
                        opts: spring,
                        settled: true,
                        dt: (now - last_time) * 60 / 1000
                    };
                    const next_value = tick_spring(ctx, last_value, value, target_value);
                    last_time = now;
                    last_value = value;
                    store.set(value = next_value);
                    if (ctx.settled) {
                        task = null;
                    }
                    return !ctx.settled;
                });
            }
            return new Promise(fulfil => {
                task.promise.then(() => {
                    if (token === current_token)
                        fulfil();
                });
            });
        }
        const spring = {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe,
            stiffness,
            damping,
            precision
        };
        return spring;
    }

    /* node_modules/svelte-multiselect/Wiggle.svelte generated by Svelte v3.53.1 */
    const file$5 = "node_modules/svelte-multiselect/Wiggle.svelte";

    function create_fragment$5(ctx) {
    	let span;

    	let style_transform = `rotate(${/*$store*/ ctx[0].angle}deg) scale(${/*$store*/ ctx[0].scale}) translate(${/*$store*/ ctx[0].dx}px,
  ${/*$store*/ ctx[0].dy}px)`;

    	let current;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (default_slot) default_slot.c();
    			set_style(span, "transform", style_transform);
    			add_location(span, file$5, 18, 0, 678);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (default_slot) {
    				default_slot.m(span, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1024)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[10],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[10])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[10], dirty, null),
    						null
    					);
    				}
    			}

    			if (dirty & /*$store*/ 1 && style_transform !== (style_transform = `rotate(${/*$store*/ ctx[0].angle}deg) scale(${/*$store*/ ctx[0].scale}) translate(${/*$store*/ ctx[0].dx}px,
  ${/*$store*/ ctx[0].dy}px)`)) {
    				set_style(span, "transform", style_transform);
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
    			if (detaching) detach_dev(span);
    			if (default_slot) default_slot.d(detaching);
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
    	let $store;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Wiggle', slots, ['default']);
    	let { wiggle = false } = $$props;
    	let { angle = 0 } = $$props;
    	let { scale = 1 } = $$props;
    	let { dx = 0 } = $$props;
    	let { dy = 0 } = $$props;
    	let { duration = 200 } = $$props;
    	let { stiffness = 0.05 } = $$props;
    	let { damping = 0.1 } = $$props;
    	let rest_state = { angle: 0, scale: 1, dx: 0, dy: 0 };
    	let store = spring(rest_state, { stiffness, damping });
    	validate_store(store, 'store');
    	component_subscribe($$self, store, value => $$invalidate(0, $store = value));
    	const writable_props = ['wiggle', 'angle', 'scale', 'dx', 'dy', 'duration', 'stiffness', 'damping'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Wiggle> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('wiggle' in $$props) $$invalidate(2, wiggle = $$props.wiggle);
    		if ('angle' in $$props) $$invalidate(3, angle = $$props.angle);
    		if ('scale' in $$props) $$invalidate(4, scale = $$props.scale);
    		if ('dx' in $$props) $$invalidate(5, dx = $$props.dx);
    		if ('dy' in $$props) $$invalidate(6, dy = $$props.dy);
    		if ('duration' in $$props) $$invalidate(7, duration = $$props.duration);
    		if ('stiffness' in $$props) $$invalidate(8, stiffness = $$props.stiffness);
    		if ('damping' in $$props) $$invalidate(9, damping = $$props.damping);
    		if ('$$scope' in $$props) $$invalidate(10, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		spring,
    		wiggle,
    		angle,
    		scale,
    		dx,
    		dy,
    		duration,
    		stiffness,
    		damping,
    		rest_state,
    		store,
    		$store
    	});

    	$$self.$inject_state = $$props => {
    		if ('wiggle' in $$props) $$invalidate(2, wiggle = $$props.wiggle);
    		if ('angle' in $$props) $$invalidate(3, angle = $$props.angle);
    		if ('scale' in $$props) $$invalidate(4, scale = $$props.scale);
    		if ('dx' in $$props) $$invalidate(5, dx = $$props.dx);
    		if ('dy' in $$props) $$invalidate(6, dy = $$props.dy);
    		if ('duration' in $$props) $$invalidate(7, duration = $$props.duration);
    		if ('stiffness' in $$props) $$invalidate(8, stiffness = $$props.stiffness);
    		if ('damping' in $$props) $$invalidate(9, damping = $$props.damping);
    		if ('rest_state' in $$props) $$invalidate(12, rest_state = $$props.rest_state);
    		if ('store' in $$props) $$invalidate(1, store = $$props.store);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*wiggle, duration*/ 132) {
    			if (wiggle) setTimeout(() => $$invalidate(2, wiggle = false), duration);
    		}

    		if ($$self.$$.dirty & /*wiggle, scale, angle, dx, dy*/ 124) {
    			store.set(wiggle ? { scale, angle, dx, dy } : rest_state);
    		}
    	};

    	return [
    		$store,
    		store,
    		wiggle,
    		angle,
    		scale,
    		dx,
    		dy,
    		duration,
    		stiffness,
    		damping,
    		$$scope,
    		slots
    	];
    }

    class Wiggle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			wiggle: 2,
    			angle: 3,
    			scale: 4,
    			dx: 5,
    			dy: 6,
    			duration: 7,
    			stiffness: 8,
    			damping: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Wiggle",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get wiggle() {
    		throw new Error("<Wiggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set wiggle(value) {
    		throw new Error("<Wiggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get angle() {
    		throw new Error("<Wiggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set angle(value) {
    		throw new Error("<Wiggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scale() {
    		throw new Error("<Wiggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scale(value) {
    		throw new Error("<Wiggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dx() {
    		throw new Error("<Wiggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dx(value) {
    		throw new Error("<Wiggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dy() {
    		throw new Error("<Wiggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dy(value) {
    		throw new Error("<Wiggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<Wiggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<Wiggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stiffness() {
    		throw new Error("<Wiggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stiffness(value) {
    		throw new Error("<Wiggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get damping() {
    		throw new Error("<Wiggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set damping(value) {
    		throw new Error("<Wiggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-multiselect/MultiSelect.svelte generated by Svelte v3.53.1 */

    const { Object: Object_1, console: console_1$1 } = globals;
    const file$4 = "node_modules/svelte-multiselect/MultiSelect.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[96] = list[i];
    	child_ctx[103] = i;

    	const constants_0 = /*option*/ child_ctx[96] instanceof Object
    	? /*option*/ child_ctx[96]
    	: { label: /*option*/ child_ctx[96] };

    	child_ctx[97] = constants_0.label;

    	child_ctx[37] = constants_0.disabled !== undefined
    	? constants_0.disabled
    	: null;

    	child_ctx[98] = constants_0.title !== undefined
    	? constants_0.title
    	: null;

    	child_ctx[99] = constants_0.selectedTitle !== undefined
    	? constants_0.selectedTitle
    	: null;

    	child_ctx[100] = constants_0.disabledTitle !== undefined
    	? constants_0.disabledTitle
    	: child_ctx[12];

    	const constants_1 = /*activeIndex*/ child_ctx[0] === /*idx*/ child_ctx[103];
    	child_ctx[101] = constants_1;
    	return child_ctx;
    }

    const get_option_slot_changes = dirty => ({ option: dirty[0] & /*matchingOptions*/ 2 });

    const get_option_slot_context = ctx => ({
    	option: /*option*/ ctx[96],
    	idx: /*idx*/ ctx[103]
    });

    const get_remove_icon_slot_changes_1 = dirty => ({});
    const get_remove_icon_slot_context_1 = ctx => ({});
    const get_disabled_icon_slot_changes = dirty => ({});
    const get_disabled_icon_slot_context = ctx => ({});
    const get_spinner_slot_changes = dirty => ({});
    const get_spinner_slot_context = ctx => ({});

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[96] = list[i];
    	child_ctx[103] = i;
    	return child_ctx;
    }

    const get_remove_icon_slot_changes = dirty => ({});
    const get_remove_icon_slot_context = ctx => ({});
    const get_selected_slot_changes = dirty => ({ option: dirty[0] & /*selected*/ 16 });

    const get_selected_slot_context = ctx => ({
    	option: /*option*/ ctx[96],
    	idx: /*idx*/ ctx[103]
    });

    // (319:10) {:else}
    function create_else_block_3(ctx) {
    	let t_value = /*get_label*/ ctx[42](/*option*/ ctx[96]) + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*selected*/ 16 && t_value !== (t_value = /*get_label*/ ctx[42](/*option*/ ctx[96]) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_3.name,
    		type: "else",
    		source: "(319:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (317:10) {#if parseLabelsAsHtml}
    function create_if_block_9(ctx) {
    	let html_tag;
    	let raw_value = /*get_label*/ ctx[42](/*option*/ ctx[96]) + "";
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag(false);
    			html_anchor = empty();
    			html_tag.a = html_anchor;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*selected*/ 16 && raw_value !== (raw_value = /*get_label*/ ctx[42](/*option*/ ctx[96]) + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(317:10) {#if parseLabelsAsHtml}",
    		ctx
    	});

    	return block;
    }

    // (316:45)            
    function fallback_block_5(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*parseLabelsAsHtml*/ ctx[29]) return create_if_block_9;
    		return create_else_block_3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_5.name,
    		type: "fallback",
    		source: "(316:45)            ",
    		ctx
    	});

    	return block;
    }

    // (323:8) {#if !disabled}
    function create_if_block_8(ctx) {
    	let button;
    	let button_title_value;
    	let current;
    	let mounted;
    	let dispose;
    	const remove_icon_slot_template = /*#slots*/ ctx[58]["remove-icon"];
    	const remove_icon_slot = create_slot(remove_icon_slot_template, ctx, /*$$scope*/ ctx[93], get_remove_icon_slot_context);
    	const remove_icon_slot_or_fallback = remove_icon_slot || fallback_block_4(ctx);

    	function mouseup_handler() {
    		return /*mouseup_handler*/ ctx[76](/*option*/ ctx[96]);
    	}

    	function keydown_handler_1() {
    		return /*keydown_handler_1*/ ctx[77](/*option*/ ctx[96]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (remove_icon_slot_or_fallback) remove_icon_slot_or_fallback.c();
    			attr_dev(button, "type", "button");
    			attr_dev(button, "title", button_title_value = "" + (/*removeBtnTitle*/ ctx[33] + " " + /*get_label*/ ctx[42](/*option*/ ctx[96])));
    			attr_dev(button, "class", "svelte-1yxj3t7");
    			add_location(button, file$4, 323, 10, 13956);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (remove_icon_slot_or_fallback) {
    				remove_icon_slot_or_fallback.m(button, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "mouseup", stop_propagation(mouseup_handler), false, false, true),
    					listen_dev(
    						button,
    						"keydown",
    						function () {
    							if (is_function(/*if_enter_or_space*/ ctx[48](keydown_handler_1))) /*if_enter_or_space*/ ctx[48](keydown_handler_1).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (remove_icon_slot) {
    				if (remove_icon_slot.p && (!current || dirty[3] & /*$$scope*/ 1)) {
    					update_slot_base(
    						remove_icon_slot,
    						remove_icon_slot_template,
    						ctx,
    						/*$$scope*/ ctx[93],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[93])
    						: get_slot_changes(remove_icon_slot_template, /*$$scope*/ ctx[93], dirty, get_remove_icon_slot_changes),
    						get_remove_icon_slot_context
    					);
    				}
    			}

    			if (!current || dirty[0] & /*selected*/ 16 | dirty[1] & /*removeBtnTitle*/ 4 && button_title_value !== (button_title_value = "" + (/*removeBtnTitle*/ ctx[33] + " " + /*get_label*/ ctx[42](/*option*/ ctx[96])))) {
    				attr_dev(button, "title", button_title_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(remove_icon_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(remove_icon_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (remove_icon_slot_or_fallback) remove_icon_slot_or_fallback.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(323:8) {#if !disabled}",
    		ctx
    	});

    	return block;
    }

    // (330:37)                
    function fallback_block_4(ctx) {
    	let crossicon;
    	let current;
    	crossicon = new Cross({ props: { width: "15px" }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(crossicon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(crossicon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(crossicon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(crossicon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(crossicon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_4.name,
    		type: "fallback",
    		source: "(330:37)                ",
    		ctx
    	});

    	return block;
    }

    // (314:4) {#each selected as option, idx}
    function create_each_block_1(ctx) {
    	let li;
    	let t;
    	let li_class_value;
    	let current;
    	const selected_slot_template = /*#slots*/ ctx[58].selected;
    	const selected_slot = create_slot(selected_slot_template, ctx, /*$$scope*/ ctx[93], get_selected_slot_context);
    	const selected_slot_or_fallback = selected_slot || fallback_block_5(ctx);
    	let if_block = !/*disabled*/ ctx[37] && create_if_block_8(ctx);

    	const block = {
    		c: function create() {
    			li = element("li");
    			if (selected_slot_or_fallback) selected_slot_or_fallback.c();
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(li, "class", li_class_value = "" + (null_to_empty(/*liSelectedClass*/ ctx[22]) + " svelte-1yxj3t7"));
    			attr_dev(li, "aria-selected", "true");
    			add_location(li, file$4, 314, 6, 13672);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);

    			if (selected_slot_or_fallback) {
    				selected_slot_or_fallback.m(li, null);
    			}

    			append_dev(li, t);
    			if (if_block) if_block.m(li, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (selected_slot) {
    				if (selected_slot.p && (!current || dirty[0] & /*selected*/ 16 | dirty[3] & /*$$scope*/ 1)) {
    					update_slot_base(
    						selected_slot,
    						selected_slot_template,
    						ctx,
    						/*$$scope*/ ctx[93],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[93])
    						: get_slot_changes(selected_slot_template, /*$$scope*/ ctx[93], dirty, get_selected_slot_changes),
    						get_selected_slot_context
    					);
    				}
    			} else {
    				if (selected_slot_or_fallback && selected_slot_or_fallback.p && (!current || dirty[0] & /*selected, parseLabelsAsHtml*/ 536870928)) {
    					selected_slot_or_fallback.p(ctx, !current ? [-1, -1, -1, -1] : dirty);
    				}
    			}

    			if (!/*disabled*/ ctx[37]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[1] & /*disabled*/ 64) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_8(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(li, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty[0] & /*liSelectedClass*/ 4194304 && li_class_value !== (li_class_value = "" + (null_to_empty(/*liSelectedClass*/ ctx[22]) + " svelte-1yxj3t7"))) {
    				attr_dev(li, "class", li_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(selected_slot_or_fallback, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(selected_slot_or_fallback, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (selected_slot_or_fallback) selected_slot_or_fallback.d(detaching);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(314:4) {#each selected as option, idx}",
    		ctx
    	});

    	return block;
    }

    // (369:2) {#if loading}
    function create_if_block_7(ctx) {
    	let current;
    	const spinner_slot_template = /*#slots*/ ctx[58].spinner;
    	const spinner_slot = create_slot(spinner_slot_template, ctx, /*$$scope*/ ctx[93], get_spinner_slot_context);
    	const spinner_slot_or_fallback = spinner_slot || fallback_block_3(ctx);

    	const block = {
    		c: function create() {
    			if (spinner_slot_or_fallback) spinner_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (spinner_slot_or_fallback) {
    				spinner_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (spinner_slot) {
    				if (spinner_slot.p && (!current || dirty[3] & /*$$scope*/ 1)) {
    					update_slot_base(
    						spinner_slot,
    						spinner_slot_template,
    						ctx,
    						/*$$scope*/ ctx[93],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[93])
    						: get_slot_changes(spinner_slot_template, /*$$scope*/ ctx[93], dirty, get_spinner_slot_changes),
    						get_spinner_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(spinner_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(spinner_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (spinner_slot_or_fallback) spinner_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(369:2) {#if loading}",
    		ctx
    	});

    	return block;
    }

    // (370:25)        
    function fallback_block_3(ctx) {
    	let circlespinner;
    	let current;
    	circlespinner = new CircleSpinner({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(circlespinner.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(circlespinner, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(circlespinner.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(circlespinner.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(circlespinner, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_3.name,
    		type: "fallback",
    		source: "(370:25)        ",
    		ctx
    	});

    	return block;
    }

    // (378:32) 
    function create_if_block_4(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*maxSelect*/ ctx[24] && (/*maxSelect*/ ctx[24] > 1 || /*maxSelectMsg*/ ctx[25]) && create_if_block_6(ctx);
    	let if_block1 = /*maxSelect*/ ctx[24] !== 1 && /*selected*/ ctx[4].length > 1 && create_if_block_5(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*maxSelect*/ ctx[24] && (/*maxSelect*/ ctx[24] > 1 || /*maxSelectMsg*/ ctx[25])) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*maxSelect, maxSelectMsg*/ 50331648) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_6(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*maxSelect*/ ctx[24] !== 1 && /*selected*/ ctx[4].length > 1) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*maxSelect, selected*/ 16777232) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_5(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(378:32) ",
    		ctx
    	});

    	return block;
    }

    // (374:2) {#if disabled}
    function create_if_block_3(ctx) {
    	let current;
    	const disabled_icon_slot_template = /*#slots*/ ctx[58]["disabled-icon"];
    	const disabled_icon_slot = create_slot(disabled_icon_slot_template, ctx, /*$$scope*/ ctx[93], get_disabled_icon_slot_context);
    	const disabled_icon_slot_or_fallback = disabled_icon_slot || fallback_block_1(ctx);

    	const block = {
    		c: function create() {
    			if (disabled_icon_slot_or_fallback) disabled_icon_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (disabled_icon_slot_or_fallback) {
    				disabled_icon_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (disabled_icon_slot) {
    				if (disabled_icon_slot.p && (!current || dirty[3] & /*$$scope*/ 1)) {
    					update_slot_base(
    						disabled_icon_slot,
    						disabled_icon_slot_template,
    						ctx,
    						/*$$scope*/ ctx[93],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[93])
    						: get_slot_changes(disabled_icon_slot_template, /*$$scope*/ ctx[93], dirty, get_disabled_icon_slot_changes),
    						get_disabled_icon_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(disabled_icon_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(disabled_icon_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (disabled_icon_slot_or_fallback) disabled_icon_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(374:2) {#if disabled}",
    		ctx
    	});

    	return block;
    }

    // (379:4) {#if maxSelect && (maxSelect > 1 || maxSelectMsg)}
    function create_if_block_6(ctx) {
    	let wiggle_1;
    	let updating_wiggle;
    	let current;

    	function wiggle_1_wiggle_binding(value) {
    		/*wiggle_1_wiggle_binding*/ ctx[80](value);
    	}

    	let wiggle_1_props = {
    		angle: 20,
    		$$slots: { default: [create_default_slot$1] },
    		$$scope: { ctx }
    	};

    	if (/*wiggle*/ ctx[38] !== void 0) {
    		wiggle_1_props.wiggle = /*wiggle*/ ctx[38];
    	}

    	wiggle_1 = new Wiggle({ props: wiggle_1_props, $$inline: true });
    	binding_callbacks.push(() => bind(wiggle_1, 'wiggle', wiggle_1_wiggle_binding));

    	const block = {
    		c: function create() {
    			create_component(wiggle_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(wiggle_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const wiggle_1_changes = {};

    			if (dirty[0] & /*maxSelectMsg, selected, maxSelect*/ 50331664 | dirty[3] & /*$$scope*/ 1) {
    				wiggle_1_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_wiggle && dirty[1] & /*wiggle*/ 128) {
    				updating_wiggle = true;
    				wiggle_1_changes.wiggle = /*wiggle*/ ctx[38];
    				add_flush_callback(() => updating_wiggle = false);
    			}

    			wiggle_1.$set(wiggle_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(wiggle_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(wiggle_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(wiggle_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(379:4) {#if maxSelect && (maxSelect > 1 || maxSelectMsg)}",
    		ctx
    	});

    	return block;
    }

    // (380:6) <Wiggle bind:wiggle angle={20}>
    function create_default_slot$1(ctx) {
    	let span;
    	let t_value = /*maxSelectMsg*/ ctx[25]?.(/*selected*/ ctx[4].length, /*maxSelect*/ ctx[24]) + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			set_style(span, "padding", "0 3pt");
    			attr_dev(span, "class", "svelte-1yxj3t7");
    			add_location(span, file$4, 380, 8, 15517);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*maxSelectMsg, selected, maxSelect*/ 50331664 && t_value !== (t_value = /*maxSelectMsg*/ ctx[25]?.(/*selected*/ ctx[4].length, /*maxSelect*/ ctx[24]) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(380:6) <Wiggle bind:wiggle angle={20}>",
    		ctx
    	});

    	return block;
    }

    // (386:4) {#if maxSelect !== 1 && selected.length > 1}
    function create_if_block_5(ctx) {
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	const remove_icon_slot_template = /*#slots*/ ctx[58]["remove-icon"];
    	const remove_icon_slot = create_slot(remove_icon_slot_template, ctx, /*$$scope*/ ctx[93], get_remove_icon_slot_context_1);
    	const remove_icon_slot_or_fallback = remove_icon_slot || fallback_block_2(ctx);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (remove_icon_slot_or_fallback) remove_icon_slot_or_fallback.c();
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "remove-all svelte-1yxj3t7");
    			attr_dev(button, "title", /*removeAllTitle*/ ctx[32]);
    			add_location(button, file$4, 386, 6, 15700);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (remove_icon_slot_or_fallback) {
    				remove_icon_slot_or_fallback.m(button, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "mouseup", stop_propagation(/*remove_all*/ ctx[47]), false, false, true),
    					listen_dev(button, "keydown", /*if_enter_or_space*/ ctx[48](/*remove_all*/ ctx[47]), false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (remove_icon_slot) {
    				if (remove_icon_slot.p && (!current || dirty[3] & /*$$scope*/ 1)) {
    					update_slot_base(
    						remove_icon_slot,
    						remove_icon_slot_template,
    						ctx,
    						/*$$scope*/ ctx[93],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[93])
    						: get_slot_changes(remove_icon_slot_template, /*$$scope*/ ctx[93], dirty, get_remove_icon_slot_changes_1),
    						get_remove_icon_slot_context_1
    					);
    				}
    			}

    			if (!current || dirty[1] & /*removeAllTitle*/ 2) {
    				attr_dev(button, "title", /*removeAllTitle*/ ctx[32]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(remove_icon_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(remove_icon_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (remove_icon_slot_or_fallback) remove_icon_slot_or_fallback.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(386:4) {#if maxSelect !== 1 && selected.length > 1}",
    		ctx
    	});

    	return block;
    }

    // (394:33)            
    function fallback_block_2(ctx) {
    	let crossicon;
    	let current;
    	crossicon = new Cross({ props: { width: "15px" }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(crossicon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(crossicon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(crossicon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(crossicon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(crossicon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_2.name,
    		type: "fallback",
    		source: "(394:33)            ",
    		ctx
    	});

    	return block;
    }

    // (375:31)        
    function fallback_block_1(ctx) {
    	let disabledicon;
    	let current;
    	disabledicon = new Disabled({ props: { width: "15px" }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(disabledicon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(disabledicon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(disabledicon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(disabledicon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(disabledicon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_1.name,
    		type: "fallback",
    		source: "(375:31)        ",
    		ctx
    	});

    	return block;
    }

    // (402:2) {#if searchText || options?.length > 0}
    function create_if_block(ctx) {
    	let ul;
    	let ul_class_value;
    	let current;
    	let each_value = /*matchingOptions*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let each_1_else = null;

    	if (!each_value.length) {
    		each_1_else = create_else_block_1(ctx);
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			if (each_1_else) {
    				each_1_else.c();
    			}

    			attr_dev(ul, "class", ul_class_value = "options " + /*ulOptionsClass*/ ctx[35] + " svelte-1yxj3t7");
    			toggle_class(ul, "hidden", !/*open*/ ctx[7]);
    			add_location(ul, file$4, 402, 4, 16189);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			if (each_1_else) {
    				each_1_else.m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*matchingOptions, liOptionClass, activeIndex, liActiveOptionClass, parseLabelsAsHtml, addOptionMsg, searchText, duplicates, selected, duplicateFunc, duplicateOptionMsg, allowUserOptions, noMatchingOptionsMsg*/ 674350619 | dirty[1] & /*is_selected, add, get_label, add_option_msg_is_active*/ 7424 | dirty[3] & /*$$scope*/ 1) {
    				each_value = /*matchingOptions*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();

    				if (!each_value.length && each_1_else) {
    					each_1_else.p(ctx, dirty);
    				} else if (!each_value.length) {
    					each_1_else = create_else_block_1(ctx);
    					each_1_else.c();
    					each_1_else.m(ul, null);
    				} else if (each_1_else) {
    					each_1_else.d(1);
    					each_1_else = null;
    				}
    			}

    			if (!current || dirty[1] & /*ulOptionsClass*/ 16 && ul_class_value !== (ul_class_value = "options " + /*ulOptionsClass*/ ctx[35] + " svelte-1yxj3t7")) {
    				attr_dev(ul, "class", ul_class_value);
    			}

    			if (!current || dirty[0] & /*open*/ 128 | dirty[1] & /*ulOptionsClass*/ 16) {
    				toggle_class(ul, "hidden", !/*open*/ ctx[7]);
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
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    			if (each_1_else) each_1_else.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(402:2) {#if searchText || options?.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (443:6) {:else}
    function create_else_block_1(ctx) {
    	let if_block_anchor;

    	function select_block_type_3(ctx, dirty) {
    		if (/*allowUserOptions*/ ctx[10] && /*searchText*/ ctx[3]) return create_if_block_2;
    		return create_else_block_2;
    	}

    	let current_block_type = select_block_type_3(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_3(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(443:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (460:8) {:else}
    function create_else_block_2(ctx) {
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*noMatchingOptionsMsg*/ ctx[27]);
    			attr_dev(span, "class", "svelte-1yxj3t7");
    			add_location(span, file$4, 460, 10, 18330);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*noMatchingOptionsMsg*/ 134217728) set_data_dev(t, /*noMatchingOptionsMsg*/ ctx[27]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(460:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (444:8) {#if allowUserOptions && searchText}
    function create_if_block_2(ctx) {
    	let li;

    	let t0_value = (!/*duplicates*/ ctx[16] && /*selected*/ ctx[4].some(/*func*/ ctx[86])
    	? /*duplicateOptionMsg*/ ctx[15]
    	: /*addOptionMsg*/ ctx[9]) + "";

    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(li, "title", /*addOptionMsg*/ ctx[9]);
    			attr_dev(li, "aria-selected", "false");
    			attr_dev(li, "class", "svelte-1yxj3t7");
    			toggle_class(li, "active", /*add_option_msg_is_active*/ ctx[39]);
    			add_location(li, file$4, 444, 10, 17623);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(li, "mousedown", stop_propagation(/*mousedown_handler_2*/ ctx[60]), false, false, true),
    					listen_dev(li, "mouseup", stop_propagation(/*mouseup_handler_2*/ ctx[87]), false, false, true),
    					listen_dev(li, "mouseover", /*mouseover_handler_1*/ ctx[88], false, false, false),
    					listen_dev(li, "focus", /*focus_handler_2*/ ctx[89], false, false, false),
    					listen_dev(li, "mouseout", /*mouseout_handler_1*/ ctx[90], false, false, false),
    					listen_dev(li, "blur", /*blur_handler_2*/ ctx[91], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*duplicates, selected, duplicateFunc, searchText, duplicateOptionMsg, addOptionMsg*/ 115224 && t0_value !== (t0_value = (!/*duplicates*/ ctx[16] && /*selected*/ ctx[4].some(/*func*/ ctx[86])
    			? /*duplicateOptionMsg*/ ctx[15]
    			: /*addOptionMsg*/ ctx[9]) + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*addOptionMsg*/ 512) {
    				attr_dev(li, "title", /*addOptionMsg*/ ctx[9]);
    			}

    			if (dirty[1] & /*add_option_msg_is_active*/ 256) {
    				toggle_class(li, "active", /*add_option_msg_is_active*/ ctx[39]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(444:8) {#if allowUserOptions && searchText}",
    		ctx
    	});

    	return block;
    }

    // (438:12) {:else}
    function create_else_block(ctx) {
    	let t_value = /*get_label*/ ctx[42](/*option*/ ctx[96]) + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*matchingOptions*/ 2 && t_value !== (t_value = /*get_label*/ ctx[42](/*option*/ ctx[96]) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(438:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (436:12) {#if parseLabelsAsHtml}
    function create_if_block_1(ctx) {
    	let html_tag;
    	let raw_value = /*get_label*/ ctx[42](/*option*/ ctx[96]) + "";
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag(false);
    			html_anchor = empty();
    			html_tag.a = html_anchor;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*matchingOptions*/ 2 && raw_value !== (raw_value = /*get_label*/ ctx[42](/*option*/ ctx[96]) + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(436:12) {#if parseLabelsAsHtml}",
    		ctx
    	});

    	return block;
    }

    // (435:45)              
    function fallback_block(ctx) {
    	let if_block_anchor;

    	function select_block_type_2(ctx, dirty) {
    		if (/*parseLabelsAsHtml*/ ctx[29]) return create_if_block_1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type_2(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_2(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(435:45)              ",
    		ctx
    	});

    	return block;
    }

    // (404:6) {#each matchingOptions as option, idx}
    function create_each_block$1(ctx) {
    	let li;
    	let t;
    	let li_title_value;
    	let li_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const option_slot_template = /*#slots*/ ctx[58].option;
    	const option_slot = create_slot(option_slot_template, ctx, /*$$scope*/ ctx[93], get_option_slot_context);
    	const option_slot_or_fallback = option_slot || fallback_block(ctx);

    	function mouseup_handler_1(...args) {
    		return /*mouseup_handler_1*/ ctx[81](/*disabled*/ ctx[37], /*label*/ ctx[97], ...args);
    	}

    	function mouseover_handler() {
    		return /*mouseover_handler*/ ctx[82](/*disabled*/ ctx[37], /*idx*/ ctx[103]);
    	}

    	function focus_handler_1() {
    		return /*focus_handler_1*/ ctx[83](/*disabled*/ ctx[37], /*idx*/ ctx[103]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			if (option_slot_or_fallback) option_slot_or_fallback.c();
    			t = space();

    			attr_dev(li, "title", li_title_value = /*disabled*/ ctx[37]
    			? /*disabledTitle*/ ctx[100]
    			: /*is_selected*/ ctx[41](/*label*/ ctx[97]) && /*selectedTitle*/ ctx[99] || /*title*/ ctx[98]);

    			attr_dev(li, "class", li_class_value = "" + (/*liOptionClass*/ ctx[21] + " " + (/*active*/ ctx[101]
    			? /*liActiveOptionClass*/ ctx[20]
    			: ``) + " svelte-1yxj3t7"));

    			attr_dev(li, "aria-selected", "false");
    			toggle_class(li, "selected", /*is_selected*/ ctx[41](/*label*/ ctx[97]));
    			toggle_class(li, "active", /*active*/ ctx[101]);
    			toggle_class(li, "disabled", /*disabled*/ ctx[37]);
    			add_location(li, file$4, 412, 8, 16580);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);

    			if (option_slot_or_fallback) {
    				option_slot_or_fallback.m(li, null);
    			}

    			append_dev(li, t);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(li, "mousedown", stop_propagation(/*mousedown_handler_1*/ ctx[59]), false, false, true),
    					listen_dev(li, "mouseup", stop_propagation(mouseup_handler_1), false, false, true),
    					listen_dev(li, "mouseover", mouseover_handler, false, false, false),
    					listen_dev(li, "focus", focus_handler_1, false, false, false),
    					listen_dev(li, "mouseout", /*mouseout_handler*/ ctx[84], false, false, false),
    					listen_dev(li, "blur", /*blur_handler_1*/ ctx[85], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (option_slot) {
    				if (option_slot.p && (!current || dirty[0] & /*matchingOptions*/ 2 | dirty[3] & /*$$scope*/ 1)) {
    					update_slot_base(
    						option_slot,
    						option_slot_template,
    						ctx,
    						/*$$scope*/ ctx[93],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[93])
    						: get_slot_changes(option_slot_template, /*$$scope*/ ctx[93], dirty, get_option_slot_changes),
    						get_option_slot_context
    					);
    				}
    			} else {
    				if (option_slot_or_fallback && option_slot_or_fallback.p && (!current || dirty[0] & /*matchingOptions, parseLabelsAsHtml*/ 536870914)) {
    					option_slot_or_fallback.p(ctx, !current ? [-1, -1, -1, -1] : dirty);
    				}
    			}

    			if (!current || dirty[0] & /*matchingOptions*/ 2 | dirty[1] & /*is_selected*/ 1024 && li_title_value !== (li_title_value = /*disabled*/ ctx[37]
    			? /*disabledTitle*/ ctx[100]
    			: /*is_selected*/ ctx[41](/*label*/ ctx[97]) && /*selectedTitle*/ ctx[99] || /*title*/ ctx[98])) {
    				attr_dev(li, "title", li_title_value);
    			}

    			if (!current || dirty[0] & /*liOptionClass, activeIndex, liActiveOptionClass*/ 3145729 && li_class_value !== (li_class_value = "" + (/*liOptionClass*/ ctx[21] + " " + (/*active*/ ctx[101]
    			? /*liActiveOptionClass*/ ctx[20]
    			: ``) + " svelte-1yxj3t7"))) {
    				attr_dev(li, "class", li_class_value);
    			}

    			if (!current || dirty[0] & /*liOptionClass, activeIndex, liActiveOptionClass, matchingOptions*/ 3145731 | dirty[1] & /*is_selected*/ 1024) {
    				toggle_class(li, "selected", /*is_selected*/ ctx[41](/*label*/ ctx[97]));
    			}

    			if (!current || dirty[0] & /*liOptionClass, activeIndex, liActiveOptionClass, activeIndex*/ 3145729) {
    				toggle_class(li, "active", /*active*/ ctx[101]);
    			}

    			if (!current || dirty[0] & /*liOptionClass, activeIndex, liActiveOptionClass, matchingOptions*/ 3145731) {
    				toggle_class(li, "disabled", /*disabled*/ ctx[37]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(option_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(option_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (option_slot_or_fallback) option_slot_or_fallback.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(404:6) {#each matchingOptions as option, idx}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div;
    	let input0;
    	let input0_value_value;
    	let t0;
    	let expandicon;
    	let t1;
    	let ul;
    	let t2;
    	let li;
    	let input1;
    	let input1_class_value;
    	let input1_placeholder_value;
    	let input1_aria_invalid_value;
    	let ul_class_value;
    	let t3;
    	let t4;
    	let current_block_type_index;
    	let if_block1;
    	let t5;
    	let div_aria_multiselectable_value;
    	let div_class_value;
    	let div_title_value;
    	let div_aria_disabled_value;
    	let current;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowresize*/ ctx[74]);

    	expandicon = new ChevronExpand({
    			props: {
    				width: "15px",
    				style: "min-width: 1em; padding: 0 1pt;"
    			},
    			$$inline: true
    		});

    	let each_value_1 = /*selected*/ ctx[4];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let if_block0 = /*loading*/ ctx[23] && create_if_block_7(ctx);
    	const if_block_creators = [create_if_block_3, create_if_block_4];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*disabled*/ ctx[37]) return 0;
    		if (/*selected*/ ctx[4].length > 0) return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type_1(ctx))) {
    		if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	let if_block2 = (/*searchText*/ ctx[3] || /*options*/ ctx[2]?.length > 0) && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			input0 = element("input");
    			t0 = space();
    			create_component(expandicon.$$.fragment);
    			t1 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			li = element("li");
    			input1 = element("input");
    			t3 = space();
    			if (if_block0) if_block0.c();
    			t4 = space();
    			if (if_block1) if_block1.c();
    			t5 = space();
    			if (if_block2) if_block2.c();
    			input0.required = /*required*/ ctx[34];
    			attr_dev(input0, "name", /*name*/ ctx[26]);

    			input0.value = input0_value_value = /*selected*/ ctx[4].length > 0
    			? JSON.stringify(/*selected*/ ctx[4])
    			: null;

    			attr_dev(input0, "tabindex", "-1");
    			attr_dev(input0, "aria-hidden", "true");
    			attr_dev(input0, "aria-label", "ignore this, used only to prevent form submission if select is required but empty");
    			attr_dev(input0, "class", "form-control svelte-1yxj3t7");
    			add_location(input0, file$4, 301, 2, 13209);
    			attr_dev(input1, "class", input1_class_value = "" + (null_to_empty(/*inputClass*/ ctx[18]) + " svelte-1yxj3t7"));
    			attr_dev(input1, "autocomplete", /*autocomplete*/ ctx[11]);
    			attr_dev(input1, "id", /*id*/ ctx[17]);
    			input1.disabled = /*disabled*/ ctx[37];
    			attr_dev(input1, "inputmode", /*inputmode*/ ctx[19]);
    			attr_dev(input1, "pattern", /*pattern*/ ctx[30]);

    			attr_dev(input1, "placeholder", input1_placeholder_value = /*selected*/ ctx[4].length == 0
    			? /*placeholder*/ ctx[31]
    			: null);

    			attr_dev(input1, "aria-invalid", input1_aria_invalid_value = /*invalid*/ ctx[6] ? `true` : null);
    			add_location(input1, file$4, 337, 6, 14407);
    			set_style(li, "display", "contents");
    			attr_dev(li, "class", "svelte-1yxj3t7");
    			add_location(li, file$4, 336, 4, 14369);
    			attr_dev(ul, "class", ul_class_value = "selected " + /*ulSelectedClass*/ ctx[36] + " svelte-1yxj3t7");
    			add_location(ul, file$4, 312, 2, 13590);
    			attr_dev(div, "aria-expanded", /*open*/ ctx[7]);
    			attr_dev(div, "aria-multiselectable", div_aria_multiselectable_value = /*maxSelect*/ ctx[24] === null || /*maxSelect*/ ctx[24] > 1);
    			attr_dev(div, "class", div_class_value = "multiselect " + /*outerDivClass*/ ctx[28] + " svelte-1yxj3t7");

    			attr_dev(div, "title", div_title_value = /*disabled*/ ctx[37]
    			? /*disabledInputTitle*/ ctx[13]
    			: null);

    			attr_dev(div, "aria-disabled", div_aria_disabled_value = /*disabled*/ ctx[37] ? `true` : null);
    			toggle_class(div, "disabled", /*disabled*/ ctx[37]);
    			toggle_class(div, "single", /*maxSelect*/ ctx[24] === 1);
    			toggle_class(div, "open", /*open*/ ctx[7]);
    			toggle_class(div, "invalid", /*invalid*/ ctx[6]);
    			add_location(div, file$4, 287, 0, 12730);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input0);
    			append_dev(div, t0);
    			mount_component(expandicon, div, null);
    			append_dev(div, t1);
    			append_dev(div, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append_dev(ul, t2);
    			append_dev(ul, li);
    			append_dev(li, input1);
    			/*input1_binding*/ ctx[78](input1);
    			set_input_value(input1, /*searchText*/ ctx[3]);
    			append_dev(div, t3);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t4);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div, null);
    			}

    			append_dev(div, t5);
    			if (if_block2) if_block2.m(div, null);
    			/*div_binding*/ ctx[92](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "click", /*on_click_outside*/ ctx[49], false, false, false),
    					listen_dev(window, "touchstart", /*on_click_outside*/ ctx[49], false, false, false),
    					listen_dev(window, "resize", /*onwindowresize*/ ctx[74]),
    					listen_dev(input0, "invalid", /*invalid_handler*/ ctx[75], false, false, false),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[79]),
    					listen_dev(input1, "mouseup", self(stop_propagation(/*open_dropdown*/ ctx[45])), false, false, true),
    					listen_dev(input1, "keydown", stop_propagation(/*handle_keydown*/ ctx[46]), false, false, true),
    					listen_dev(input1, "focus", /*focus_handler*/ ctx[61], false, false, false),
    					listen_dev(input1, "focus", /*open_dropdown*/ ctx[45], false, false, false),
    					listen_dev(input1, "blur", /*blur_handler*/ ctx[62], false, false, false),
    					listen_dev(input1, "change", /*change_handler*/ ctx[63], false, false, false),
    					listen_dev(input1, "click", /*click_handler*/ ctx[64], false, false, false),
    					listen_dev(input1, "keydown", /*keydown_handler*/ ctx[65], false, false, false),
    					listen_dev(input1, "keyup", /*keyup_handler*/ ctx[66], false, false, false),
    					listen_dev(input1, "mousedown", /*mousedown_handler*/ ctx[67], false, false, false),
    					listen_dev(input1, "mouseenter", /*mouseenter_handler*/ ctx[68], false, false, false),
    					listen_dev(input1, "mouseleave", /*mouseleave_handler*/ ctx[69], false, false, false),
    					listen_dev(input1, "touchcancel", /*touchcancel_handler*/ ctx[70], false, false, false),
    					listen_dev(input1, "touchend", /*touchend_handler*/ ctx[71], false, false, false),
    					listen_dev(input1, "touchmove", /*touchmove_handler*/ ctx[72], false, false, false),
    					listen_dev(input1, "touchstart", /*touchstart_handler*/ ctx[73], false, false, false),
    					listen_dev(div, "mouseup", stop_propagation(/*open_dropdown*/ ctx[45]), false, false, true)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty[1] & /*required*/ 8) {
    				prop_dev(input0, "required", /*required*/ ctx[34]);
    			}

    			if (!current || dirty[0] & /*name*/ 67108864) {
    				attr_dev(input0, "name", /*name*/ ctx[26]);
    			}

    			if (!current || dirty[0] & /*selected*/ 16 && input0_value_value !== (input0_value_value = /*selected*/ ctx[4].length > 0
    			? JSON.stringify(/*selected*/ ctx[4])
    			: null) && input0.value !== input0_value_value) {
    				prop_dev(input0, "value", input0_value_value);
    			}

    			if (dirty[0] & /*liSelectedClass, selected, parseLabelsAsHtml*/ 541065232 | dirty[1] & /*removeBtnTitle, get_label, remove, if_enter_or_space, disabled*/ 141380 | dirty[3] & /*$$scope*/ 1) {
    				each_value_1 = /*selected*/ ctx[4];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul, t2);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty[0] & /*inputClass*/ 262144 && input1_class_value !== (input1_class_value = "" + (null_to_empty(/*inputClass*/ ctx[18]) + " svelte-1yxj3t7"))) {
    				attr_dev(input1, "class", input1_class_value);
    			}

    			if (!current || dirty[0] & /*autocomplete*/ 2048) {
    				attr_dev(input1, "autocomplete", /*autocomplete*/ ctx[11]);
    			}

    			if (!current || dirty[0] & /*id*/ 131072) {
    				attr_dev(input1, "id", /*id*/ ctx[17]);
    			}

    			if (!current || dirty[1] & /*disabled*/ 64) {
    				prop_dev(input1, "disabled", /*disabled*/ ctx[37]);
    			}

    			if (!current || dirty[0] & /*inputmode*/ 524288) {
    				attr_dev(input1, "inputmode", /*inputmode*/ ctx[19]);
    			}

    			if (!current || dirty[0] & /*pattern*/ 1073741824) {
    				attr_dev(input1, "pattern", /*pattern*/ ctx[30]);
    			}

    			if (!current || dirty[0] & /*selected*/ 16 | dirty[1] & /*placeholder*/ 1 && input1_placeholder_value !== (input1_placeholder_value = /*selected*/ ctx[4].length == 0
    			? /*placeholder*/ ctx[31]
    			: null)) {
    				attr_dev(input1, "placeholder", input1_placeholder_value);
    			}

    			if (!current || dirty[0] & /*invalid*/ 64 && input1_aria_invalid_value !== (input1_aria_invalid_value = /*invalid*/ ctx[6] ? `true` : null)) {
    				attr_dev(input1, "aria-invalid", input1_aria_invalid_value);
    			}

    			if (dirty[0] & /*searchText*/ 8 && input1.value !== /*searchText*/ ctx[3]) {
    				set_input_value(input1, /*searchText*/ ctx[3]);
    			}

    			if (!current || dirty[1] & /*ulSelectedClass*/ 32 && ul_class_value !== (ul_class_value = "selected " + /*ulSelectedClass*/ ctx[36] + " svelte-1yxj3t7")) {
    				attr_dev(ul, "class", ul_class_value);
    			}

    			if (/*loading*/ ctx[23]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*loading*/ 8388608) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_7(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div, t4);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block1) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block1 = if_blocks[current_block_type_index];

    					if (!if_block1) {
    						if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block1.c();
    					} else {
    						if_block1.p(ctx, dirty);
    					}

    					transition_in(if_block1, 1);
    					if_block1.m(div, t5);
    				} else {
    					if_block1 = null;
    				}
    			}

    			if (/*searchText*/ ctx[3] || /*options*/ ctx[2]?.length > 0) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[0] & /*searchText, options*/ 12) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty[0] & /*open*/ 128) {
    				attr_dev(div, "aria-expanded", /*open*/ ctx[7]);
    			}

    			if (!current || dirty[0] & /*maxSelect*/ 16777216 && div_aria_multiselectable_value !== (div_aria_multiselectable_value = /*maxSelect*/ ctx[24] === null || /*maxSelect*/ ctx[24] > 1)) {
    				attr_dev(div, "aria-multiselectable", div_aria_multiselectable_value);
    			}

    			if (!current || dirty[0] & /*outerDivClass*/ 268435456 && div_class_value !== (div_class_value = "multiselect " + /*outerDivClass*/ ctx[28] + " svelte-1yxj3t7")) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (!current || dirty[0] & /*disabledInputTitle*/ 8192 | dirty[1] & /*disabled*/ 64 && div_title_value !== (div_title_value = /*disabled*/ ctx[37]
    			? /*disabledInputTitle*/ ctx[13]
    			: null)) {
    				attr_dev(div, "title", div_title_value);
    			}

    			if (!current || dirty[1] & /*disabled*/ 64 && div_aria_disabled_value !== (div_aria_disabled_value = /*disabled*/ ctx[37] ? `true` : null)) {
    				attr_dev(div, "aria-disabled", div_aria_disabled_value);
    			}

    			if (!current || dirty[0] & /*outerDivClass*/ 268435456 | dirty[1] & /*disabled*/ 64) {
    				toggle_class(div, "disabled", /*disabled*/ ctx[37]);
    			}

    			if (!current || dirty[0] & /*outerDivClass, maxSelect*/ 285212672) {
    				toggle_class(div, "single", /*maxSelect*/ ctx[24] === 1);
    			}

    			if (!current || dirty[0] & /*outerDivClass, open*/ 268435584) {
    				toggle_class(div, "open", /*open*/ ctx[7]);
    			}

    			if (!current || dirty[0] & /*outerDivClass, invalid*/ 268435520) {
    				toggle_class(div, "invalid", /*invalid*/ ctx[6]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(expandicon.$$.fragment, local);

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(expandicon.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(expandicon);
    			destroy_each(each_blocks, detaching);
    			/*input1_binding*/ ctx[78](null);
    			if (if_block0) if_block0.d();

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			if (if_block2) if_block2.d();
    			/*div_binding*/ ctx[92](null);
    			mounted = false;
    			run_all(dispose);
    		}
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
    	let is_selected;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MultiSelect', slots, ['selected','remove-icon','spinner','disabled-icon','option']);
    	let { activeIndex = null } = $$props;
    	let { activeOption = null } = $$props;
    	let { addOptionMsg = `Create this option...` } = $$props;
    	let { allowUserOptions = false } = $$props;
    	let { autocomplete = `off` } = $$props;
    	let { autoScroll = true } = $$props;
    	let { breakpoint = 800 } = $$props;
    	let { defaultDisabledTitle = `This option is disabled` } = $$props;
    	let { disabled = false } = $$props;
    	let { disabledInputTitle = `This input is disabled` } = $$props;
    	let { duplicateFunc = (op1, op2) => `${get_label(op1)}`.toLowerCase() === `${get_label(op2)}`.toLowerCase() } = $$props;
    	let { duplicateOptionMsg = `This option is already selected` } = $$props;
    	let { duplicates = false } = $$props;

    	let { filterFunc = (op, searchText) => {
    		if (!searchText) return true;
    		return `${get_label(op)}`.toLowerCase().includes(searchText.toLowerCase());
    	} } = $$props;

    	let { focusInputOnSelect = `desktop` } = $$props;
    	let { id = null } = $$props;
    	let { input = null } = $$props;
    	let { inputClass = `` } = $$props;
    	let { inputmode = null } = $$props;
    	let { invalid = false } = $$props;
    	let { liActiveOptionClass = `` } = $$props;
    	let { liOptionClass = `` } = $$props;
    	let { liSelectedClass = `` } = $$props;
    	let { loading = false } = $$props;
    	let { matchingOptions = [] } = $$props;
    	let { maxSelect = null } = $$props;
    	let { maxSelectMsg = (current, max) => max > 1 ? `${current}/${max}` : `` } = $$props;
    	let { name = null } = $$props;
    	let { noMatchingOptionsMsg = `No matching options` } = $$props;
    	let { open = false } = $$props;
    	let { options } = $$props;
    	let { outerDiv = null } = $$props;
    	let { outerDivClass = `` } = $$props;
    	let { parseLabelsAsHtml = false } = $$props;
    	let { pattern = null } = $$props;
    	let { placeholder = null } = $$props;
    	let { removeAllTitle = `Remove all` } = $$props;
    	let { removeBtnTitle = `Remove` } = $$props;
    	let { required = false } = $$props;
    	let { resetFilterOnAdd = true } = $$props;
    	let { searchText = `` } = $$props;
    	let { selected = options?.filter(op => op?.preselected).slice(0, maxSelect ?? undefined) ?? [] } = $$props;
    	let { sortSelected = false } = $$props;
    	let { ulOptionsClass = `` } = $$props;
    	let { ulSelectedClass = `` } = $$props;
    	let { value = null } = $$props;

    	// get the label key from an option object or the option itself if it's a string or number
    	const get_label = op => op instanceof Object ? op.label : op;

    	let wiggle = false; // controls wiggle animation when user tries to exceed maxSelect

    	if (!(options?.length > 0)) {
    		if (allowUserOptions) {
    			options = []; // initializing as array avoids errors when component mounts
    		} else {
    			// only error for empty options if user is not allowed to create custom options
    			console.error(`MultiSelect received no options`);
    		}
    	}

    	if (parseLabelsAsHtml && allowUserOptions) {
    		console.warn(`Don't combine parseLabelsAsHtml and allowUserOptions. It's susceptible to XSS attacks!`);
    	}

    	if (maxSelect !== null && maxSelect < 1) {
    		console.error(`maxSelect must be null or positive integer, got ${maxSelect}`);
    	}

    	if (!Array.isArray(selected)) {
    		console.error(`internal variable selected prop should always be an array, got ${selected}`);
    	}

    	const dispatch = createEventDispatcher();
    	let add_option_msg_is_active = false; // controls active state of <li>{addOptionMsg}</li>
    	let window_width;

    	// raise if matchingOptions[activeIndex] does not yield a value
    	if (activeIndex !== null && !matchingOptions[activeIndex]) {
    		throw `Run time error, activeIndex=${activeIndex} is out of bounds, matchingOptions.length=${matchingOptions.length}`;
    	}

    	// add an option to selected list
    	function add(label, event) {
    		if (maxSelect && maxSelect > 1 && selected.length >= maxSelect) $$invalidate(38, wiggle = true);
    		if (!isNaN(Number(label)) && typeof selected.map(get_label)[0] === `number`) label = Number(label); // convert to number if possible
    		const is_duplicate = selected.some(option => duplicateFunc(option, label));

    		if ((maxSelect === null || maxSelect === 1 || selected.length < maxSelect) && (duplicates || !is_duplicate)) {
    			// first check if we find option in the options list
    			let option = options.find(op => get_label(op) === label);

    			if (!option && // this has the side-effect of not allowing to user to add the same
    			// custom option twice in append mode
    			[true, `append`].includes(allowUserOptions) && searchText.length > 0) {
    				// user entered text but no options match, so if allowUserOptions=true | 'append', we create
    				// a new option from the user-entered text
    				if (typeof options[0] === `object`) {
    					// if 1st option is an object, we create new option as object to keep type homogeneity
    					option = { label: searchText, value: searchText };
    				} else {
    					if ([`number`, `undefined`].includes(typeof options[0]) && !isNaN(Number(searchText))) {
    						// create new option as number if it parses to a number and 1st option is also number or missing
    						option = Number(searchText);
    					} else option = searchText; // else create custom option as string
    				}

    				if (allowUserOptions === `append`) $$invalidate(2, options = [...options, option]);
    			}

    			if (option === undefined) {
    				throw `Run time error, option with label ${label} not found in options list`;
    			}

    			if (resetFilterOnAdd) $$invalidate(3, searchText = ``); // reset search string on selection

    			if ([``, undefined, null].includes(option)) {
    				console.error(`MultiSelect: encountered missing option with label ${label} (or option is poorly labeled)`);
    				return;
    			}

    			if (maxSelect === 1) {
    				// for maxselect = 1 we always replace current option with new one
    				$$invalidate(4, selected = [option]);
    			} else {
    				$$invalidate(4, selected = [...selected, option]);

    				if (sortSelected === true) {
    					$$invalidate(4, selected = selected.sort((op1, op2) => {
    						const [label1, label2] = [get_label(op1), get_label(op2)];

    						// coerce to string if labels are numbers
    						return `${label1}`.localeCompare(`${label2}`);
    					}));
    				} else if (typeof sortSelected === `function`) {
    					$$invalidate(4, selected = selected.sort(sortSelected));
    				}
    			}

    			if (selected.length === maxSelect) close_dropdown(event); else if (focusInputOnSelect === true || focusInputOnSelect === `desktop` && window_width > breakpoint) {
    				input?.focus();
    			}

    			dispatch(`add`, { option });
    			dispatch(`change`, { option, type: `add` });
    			$$invalidate(6, invalid = false); // reset error status whenever new items are selected
    		}
    	}

    	// remove an option from selected list
    	function remove(label) {
    		if (selected.length === 0) return;
    		selected.splice(selected.map(get_label).lastIndexOf(label), 1);
    		$$invalidate(4, selected); // Svelte rerender after in-place splice

    		const option = options.find(option => get_label(option) === label) ?? (// if option with label could not be found but allowUserOptions is truthy,
    		// assume it was created by user and create correspondidng option object
    		// on the fly for use as event payload
    		allowUserOptions && { label, value: label });

    		if (!option) {
    			return console.error(`MultiSelect: option with label ${label} not found`);
    		}

    		dispatch(`remove`, { option });
    		dispatch(`change`, { option, type: `remove` });
    		$$invalidate(6, invalid = false); // reset error status whenever items are removed
    	}

    	function open_dropdown(event) {
    		if (disabled) return;
    		$$invalidate(7, open = true);

    		if (!(event instanceof FocusEvent)) {
    			// avoid double-focussing input when event that opened dropdown was already input FocusEvent
    			input?.focus();
    		}

    		dispatch(`open`, { event });
    	}

    	function close_dropdown(event) {
    		$$invalidate(7, open = false);
    		input?.blur();
    		$$invalidate(50, activeOption = null);
    		dispatch(`close`, { event });
    	}

    	// handle all keyboard events this component receives
    	async function handle_keydown(event) {
    		// on escape or tab out of input: dismiss options dropdown and reset search text
    		if (event.key === `Escape` || event.key === `Tab`) {
    			close_dropdown(event);
    			$$invalidate(3, searchText = ``);
    		} else // on enter key: toggle active option and reset search text
    		if (event.key === `Enter`) {
    			event.preventDefault(); // prevent enter key from triggering form submission

    			if (activeOption) {
    				const label = get_label(activeOption);

    				selected.map(get_label).includes(label)
    				? remove(label)
    				: add(label, event);

    				$$invalidate(3, searchText = ``);
    			} else if (allowUserOptions && searchText.length > 0) {
    				// user entered text but no options match, so if allowUserOptions is truthy, we create new option
    				add(searchText, event);
    			} else // no active option and no search text means the options dropdown is closed
    			// in which case enter means open it
    			open_dropdown(event);
    		} else // on up/down arrow keys: update active option
    		if ([`ArrowDown`, `ArrowUp`].includes(event.key)) {
    			// if no option is active yet, but there are matching options, make first one active
    			if (activeIndex === null && matchingOptions.length > 0) {
    				$$invalidate(0, activeIndex = 0);
    				return;
    			} else if (allowUserOptions && searchText.length > 0) {
    				// if allowUserOptions is truthy and user entered text but no options match, we make
    				// <li>{addUserMsg}</li> active on keydown (or toggle it if already active)
    				$$invalidate(39, add_option_msg_is_active = !add_option_msg_is_active);

    				return;
    			} else if (activeIndex === null) {
    				// if no option is active and no options are matching, do nothing
    				return;
    			}

    			const increment = event.key === `ArrowUp` ? -1 : 1;
    			$$invalidate(0, activeIndex = (activeIndex + increment) % matchingOptions.length);

    			// % in JS behaves like remainder operator, not real modulo, so negative numbers stay negative
    			// need to do manual wrap around at 0
    			if (activeIndex < 0) $$invalidate(0, activeIndex = matchingOptions.length - 1);

    			if (autoScroll) {
    				// TODO This ugly timeout hack is needed to properly scroll element into view when wrapping
    				// around start/end of option list. Find a better solution than waiting 10 ms.
    				await tick();

    				const li = document.querySelector(`ul.options > li.active`);

    				if (li) {
    					li.parentNode?.scrollIntoView?.({ block: `center` });
    					li.scrollIntoViewIfNeeded?.();
    				}
    			}
    		} else // on backspace key: remove last selected option
    		if (event.key === `Backspace` && selected.length > 0 && !searchText) {
    			remove(selected.map(get_label).at(-1));
    		}
    	}

    	function remove_all() {
    		dispatch(`removeAll`, { options: selected });
    		dispatch(`change`, { options: selected, type: `removeAll` });
    		$$invalidate(4, selected = []);
    		$$invalidate(3, searchText = ``);
    	}

    	const if_enter_or_space = handler => event => {
    		if ([`Enter`, `Space`].includes(event.code)) {
    			event.preventDefault();
    			handler();
    		}
    	};

    	function on_click_outside(event) {
    		if (outerDiv && !outerDiv.contains(event.target)) {
    			close_dropdown(event);
    		}
    	}

    	$$self.$$.on_mount.push(function () {
    		if (options === undefined && !('options' in $$props || $$self.$$.bound[$$self.$$.props['options']])) {
    			console_1$1.warn("<MultiSelect> was created without expected prop 'options'");
    		}
    	});

    	const writable_props = [
    		'activeIndex',
    		'activeOption',
    		'addOptionMsg',
    		'allowUserOptions',
    		'autocomplete',
    		'autoScroll',
    		'breakpoint',
    		'defaultDisabledTitle',
    		'disabled',
    		'disabledInputTitle',
    		'duplicateFunc',
    		'duplicateOptionMsg',
    		'duplicates',
    		'filterFunc',
    		'focusInputOnSelect',
    		'id',
    		'input',
    		'inputClass',
    		'inputmode',
    		'invalid',
    		'liActiveOptionClass',
    		'liOptionClass',
    		'liSelectedClass',
    		'loading',
    		'matchingOptions',
    		'maxSelect',
    		'maxSelectMsg',
    		'name',
    		'noMatchingOptionsMsg',
    		'open',
    		'options',
    		'outerDiv',
    		'outerDivClass',
    		'parseLabelsAsHtml',
    		'pattern',
    		'placeholder',
    		'removeAllTitle',
    		'removeBtnTitle',
    		'required',
    		'resetFilterOnAdd',
    		'searchText',
    		'selected',
    		'sortSelected',
    		'ulOptionsClass',
    		'ulSelectedClass',
    		'value'
    	];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<MultiSelect> was created with unknown prop '${key}'`);
    	});

    	function mousedown_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mousedown_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mousedown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function touchcancel_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function touchend_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function touchmove_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function touchstart_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function onwindowresize() {
    		$$invalidate(40, window_width = window.innerWidth);
    	}

    	const invalid_handler = () => $$invalidate(6, invalid = true);
    	const mouseup_handler = option => remove(get_label(option));
    	const keydown_handler_1 = option => remove(get_label(option));

    	function input1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			input = $$value;
    			$$invalidate(5, input);
    		});
    	}

    	function input1_input_handler() {
    		searchText = this.value;
    		$$invalidate(3, searchText);
    	}

    	function wiggle_1_wiggle_binding(value) {
    		wiggle = value;
    		$$invalidate(38, wiggle);
    	}

    	const mouseup_handler_1 = (disabled, label, event) => {
    		if (!disabled) add(label, event);
    	};

    	const mouseover_handler = (disabled, idx) => {
    		if (!disabled) $$invalidate(0, activeIndex = idx);
    	};

    	const focus_handler_1 = (disabled, idx) => {
    		if (!disabled) $$invalidate(0, activeIndex = idx);
    	};

    	const mouseout_handler = () => $$invalidate(0, activeIndex = null);
    	const blur_handler_1 = () => $$invalidate(0, activeIndex = null);
    	const func = option => duplicateFunc(option, searchText);
    	const mouseup_handler_2 = event => add(searchText, event);
    	const mouseover_handler_1 = () => $$invalidate(39, add_option_msg_is_active = true);
    	const focus_handler_2 = () => $$invalidate(39, add_option_msg_is_active = true);
    	const mouseout_handler_1 = () => $$invalidate(39, add_option_msg_is_active = false);
    	const blur_handler_2 = () => $$invalidate(39, add_option_msg_is_active = false);

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			outerDiv = $$value;
    			$$invalidate(8, outerDiv);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('activeIndex' in $$props) $$invalidate(0, activeIndex = $$props.activeIndex);
    		if ('activeOption' in $$props) $$invalidate(50, activeOption = $$props.activeOption);
    		if ('addOptionMsg' in $$props) $$invalidate(9, addOptionMsg = $$props.addOptionMsg);
    		if ('allowUserOptions' in $$props) $$invalidate(10, allowUserOptions = $$props.allowUserOptions);
    		if ('autocomplete' in $$props) $$invalidate(11, autocomplete = $$props.autocomplete);
    		if ('autoScroll' in $$props) $$invalidate(52, autoScroll = $$props.autoScroll);
    		if ('breakpoint' in $$props) $$invalidate(53, breakpoint = $$props.breakpoint);
    		if ('defaultDisabledTitle' in $$props) $$invalidate(12, defaultDisabledTitle = $$props.defaultDisabledTitle);
    		if ('disabled' in $$props) $$invalidate(37, disabled = $$props.disabled);
    		if ('disabledInputTitle' in $$props) $$invalidate(13, disabledInputTitle = $$props.disabledInputTitle);
    		if ('duplicateFunc' in $$props) $$invalidate(14, duplicateFunc = $$props.duplicateFunc);
    		if ('duplicateOptionMsg' in $$props) $$invalidate(15, duplicateOptionMsg = $$props.duplicateOptionMsg);
    		if ('duplicates' in $$props) $$invalidate(16, duplicates = $$props.duplicates);
    		if ('filterFunc' in $$props) $$invalidate(54, filterFunc = $$props.filterFunc);
    		if ('focusInputOnSelect' in $$props) $$invalidate(55, focusInputOnSelect = $$props.focusInputOnSelect);
    		if ('id' in $$props) $$invalidate(17, id = $$props.id);
    		if ('input' in $$props) $$invalidate(5, input = $$props.input);
    		if ('inputClass' in $$props) $$invalidate(18, inputClass = $$props.inputClass);
    		if ('inputmode' in $$props) $$invalidate(19, inputmode = $$props.inputmode);
    		if ('invalid' in $$props) $$invalidate(6, invalid = $$props.invalid);
    		if ('liActiveOptionClass' in $$props) $$invalidate(20, liActiveOptionClass = $$props.liActiveOptionClass);
    		if ('liOptionClass' in $$props) $$invalidate(21, liOptionClass = $$props.liOptionClass);
    		if ('liSelectedClass' in $$props) $$invalidate(22, liSelectedClass = $$props.liSelectedClass);
    		if ('loading' in $$props) $$invalidate(23, loading = $$props.loading);
    		if ('matchingOptions' in $$props) $$invalidate(1, matchingOptions = $$props.matchingOptions);
    		if ('maxSelect' in $$props) $$invalidate(24, maxSelect = $$props.maxSelect);
    		if ('maxSelectMsg' in $$props) $$invalidate(25, maxSelectMsg = $$props.maxSelectMsg);
    		if ('name' in $$props) $$invalidate(26, name = $$props.name);
    		if ('noMatchingOptionsMsg' in $$props) $$invalidate(27, noMatchingOptionsMsg = $$props.noMatchingOptionsMsg);
    		if ('open' in $$props) $$invalidate(7, open = $$props.open);
    		if ('options' in $$props) $$invalidate(2, options = $$props.options);
    		if ('outerDiv' in $$props) $$invalidate(8, outerDiv = $$props.outerDiv);
    		if ('outerDivClass' in $$props) $$invalidate(28, outerDivClass = $$props.outerDivClass);
    		if ('parseLabelsAsHtml' in $$props) $$invalidate(29, parseLabelsAsHtml = $$props.parseLabelsAsHtml);
    		if ('pattern' in $$props) $$invalidate(30, pattern = $$props.pattern);
    		if ('placeholder' in $$props) $$invalidate(31, placeholder = $$props.placeholder);
    		if ('removeAllTitle' in $$props) $$invalidate(32, removeAllTitle = $$props.removeAllTitle);
    		if ('removeBtnTitle' in $$props) $$invalidate(33, removeBtnTitle = $$props.removeBtnTitle);
    		if ('required' in $$props) $$invalidate(34, required = $$props.required);
    		if ('resetFilterOnAdd' in $$props) $$invalidate(56, resetFilterOnAdd = $$props.resetFilterOnAdd);
    		if ('searchText' in $$props) $$invalidate(3, searchText = $$props.searchText);
    		if ('selected' in $$props) $$invalidate(4, selected = $$props.selected);
    		if ('sortSelected' in $$props) $$invalidate(57, sortSelected = $$props.sortSelected);
    		if ('ulOptionsClass' in $$props) $$invalidate(35, ulOptionsClass = $$props.ulOptionsClass);
    		if ('ulSelectedClass' in $$props) $$invalidate(36, ulSelectedClass = $$props.ulSelectedClass);
    		if ('value' in $$props) $$invalidate(51, value = $$props.value);
    		if ('$$scope' in $$props) $$invalidate(93, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		tick,
    		CircleSpinner,
    		CrossIcon: Cross,
    		DisabledIcon: Disabled,
    		ExpandIcon: ChevronExpand,
    		Wiggle,
    		activeIndex,
    		activeOption,
    		addOptionMsg,
    		allowUserOptions,
    		autocomplete,
    		autoScroll,
    		breakpoint,
    		defaultDisabledTitle,
    		disabled,
    		disabledInputTitle,
    		duplicateFunc,
    		duplicateOptionMsg,
    		duplicates,
    		filterFunc,
    		focusInputOnSelect,
    		id,
    		input,
    		inputClass,
    		inputmode,
    		invalid,
    		liActiveOptionClass,
    		liOptionClass,
    		liSelectedClass,
    		loading,
    		matchingOptions,
    		maxSelect,
    		maxSelectMsg,
    		name,
    		noMatchingOptionsMsg,
    		open,
    		options,
    		outerDiv,
    		outerDivClass,
    		parseLabelsAsHtml,
    		pattern,
    		placeholder,
    		removeAllTitle,
    		removeBtnTitle,
    		required,
    		resetFilterOnAdd,
    		searchText,
    		selected,
    		sortSelected,
    		ulOptionsClass,
    		ulSelectedClass,
    		value,
    		get_label,
    		wiggle,
    		dispatch,
    		add_option_msg_is_active,
    		window_width,
    		add,
    		remove,
    		open_dropdown,
    		close_dropdown,
    		handle_keydown,
    		remove_all,
    		if_enter_or_space,
    		on_click_outside,
    		is_selected
    	});

    	$$self.$inject_state = $$props => {
    		if ('activeIndex' in $$props) $$invalidate(0, activeIndex = $$props.activeIndex);
    		if ('activeOption' in $$props) $$invalidate(50, activeOption = $$props.activeOption);
    		if ('addOptionMsg' in $$props) $$invalidate(9, addOptionMsg = $$props.addOptionMsg);
    		if ('allowUserOptions' in $$props) $$invalidate(10, allowUserOptions = $$props.allowUserOptions);
    		if ('autocomplete' in $$props) $$invalidate(11, autocomplete = $$props.autocomplete);
    		if ('autoScroll' in $$props) $$invalidate(52, autoScroll = $$props.autoScroll);
    		if ('breakpoint' in $$props) $$invalidate(53, breakpoint = $$props.breakpoint);
    		if ('defaultDisabledTitle' in $$props) $$invalidate(12, defaultDisabledTitle = $$props.defaultDisabledTitle);
    		if ('disabled' in $$props) $$invalidate(37, disabled = $$props.disabled);
    		if ('disabledInputTitle' in $$props) $$invalidate(13, disabledInputTitle = $$props.disabledInputTitle);
    		if ('duplicateFunc' in $$props) $$invalidate(14, duplicateFunc = $$props.duplicateFunc);
    		if ('duplicateOptionMsg' in $$props) $$invalidate(15, duplicateOptionMsg = $$props.duplicateOptionMsg);
    		if ('duplicates' in $$props) $$invalidate(16, duplicates = $$props.duplicates);
    		if ('filterFunc' in $$props) $$invalidate(54, filterFunc = $$props.filterFunc);
    		if ('focusInputOnSelect' in $$props) $$invalidate(55, focusInputOnSelect = $$props.focusInputOnSelect);
    		if ('id' in $$props) $$invalidate(17, id = $$props.id);
    		if ('input' in $$props) $$invalidate(5, input = $$props.input);
    		if ('inputClass' in $$props) $$invalidate(18, inputClass = $$props.inputClass);
    		if ('inputmode' in $$props) $$invalidate(19, inputmode = $$props.inputmode);
    		if ('invalid' in $$props) $$invalidate(6, invalid = $$props.invalid);
    		if ('liActiveOptionClass' in $$props) $$invalidate(20, liActiveOptionClass = $$props.liActiveOptionClass);
    		if ('liOptionClass' in $$props) $$invalidate(21, liOptionClass = $$props.liOptionClass);
    		if ('liSelectedClass' in $$props) $$invalidate(22, liSelectedClass = $$props.liSelectedClass);
    		if ('loading' in $$props) $$invalidate(23, loading = $$props.loading);
    		if ('matchingOptions' in $$props) $$invalidate(1, matchingOptions = $$props.matchingOptions);
    		if ('maxSelect' in $$props) $$invalidate(24, maxSelect = $$props.maxSelect);
    		if ('maxSelectMsg' in $$props) $$invalidate(25, maxSelectMsg = $$props.maxSelectMsg);
    		if ('name' in $$props) $$invalidate(26, name = $$props.name);
    		if ('noMatchingOptionsMsg' in $$props) $$invalidate(27, noMatchingOptionsMsg = $$props.noMatchingOptionsMsg);
    		if ('open' in $$props) $$invalidate(7, open = $$props.open);
    		if ('options' in $$props) $$invalidate(2, options = $$props.options);
    		if ('outerDiv' in $$props) $$invalidate(8, outerDiv = $$props.outerDiv);
    		if ('outerDivClass' in $$props) $$invalidate(28, outerDivClass = $$props.outerDivClass);
    		if ('parseLabelsAsHtml' in $$props) $$invalidate(29, parseLabelsAsHtml = $$props.parseLabelsAsHtml);
    		if ('pattern' in $$props) $$invalidate(30, pattern = $$props.pattern);
    		if ('placeholder' in $$props) $$invalidate(31, placeholder = $$props.placeholder);
    		if ('removeAllTitle' in $$props) $$invalidate(32, removeAllTitle = $$props.removeAllTitle);
    		if ('removeBtnTitle' in $$props) $$invalidate(33, removeBtnTitle = $$props.removeBtnTitle);
    		if ('required' in $$props) $$invalidate(34, required = $$props.required);
    		if ('resetFilterOnAdd' in $$props) $$invalidate(56, resetFilterOnAdd = $$props.resetFilterOnAdd);
    		if ('searchText' in $$props) $$invalidate(3, searchText = $$props.searchText);
    		if ('selected' in $$props) $$invalidate(4, selected = $$props.selected);
    		if ('sortSelected' in $$props) $$invalidate(57, sortSelected = $$props.sortSelected);
    		if ('ulOptionsClass' in $$props) $$invalidate(35, ulOptionsClass = $$props.ulOptionsClass);
    		if ('ulSelectedClass' in $$props) $$invalidate(36, ulSelectedClass = $$props.ulSelectedClass);
    		if ('value' in $$props) $$invalidate(51, value = $$props.value);
    		if ('wiggle' in $$props) $$invalidate(38, wiggle = $$props.wiggle);
    		if ('add_option_msg_is_active' in $$props) $$invalidate(39, add_option_msg_is_active = $$props.add_option_msg_is_active);
    		if ('window_width' in $$props) $$invalidate(40, window_width = $$props.window_width);
    		if ('is_selected' in $$props) $$invalidate(41, is_selected = $$props.is_selected);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*maxSelect, selected*/ 16777232) {
    			// if maxSelect=1, value is the single item in selected (or null if selected is empty)
    			// this solves both https://github.com/janosh/svelte-multiselect/issues/86 and
    			// https://github.com/janosh/svelte-multiselect/issues/136
    			$$invalidate(51, value = maxSelect === 1 ? selected[0] ?? null : selected);
    		}

    		if ($$self.$$.dirty[0] & /*options, searchText, selected*/ 28 | $$self.$$.dirty[1] & /*filterFunc*/ 8388608) {
    			// options matching the current search text
    			$$invalidate(1, matchingOptions = options.filter(op => filterFunc(op, searchText) && !selected.map(get_label).includes(get_label(op)))); // remove already selected options from dropdown list
    		}

    		if ($$self.$$.dirty[0] & /*activeIndex, matchingOptions*/ 3) {
    			// update activeOption when activeIndex changes
    			$$invalidate(50, activeOption = activeIndex !== null
    			? matchingOptions[activeIndex]
    			: null);
    		}

    		if ($$self.$$.dirty[0] & /*selected*/ 16) {
    			$$invalidate(41, is_selected = label => selected.map(get_label).includes(label));
    		}
    	};

    	return [
    		activeIndex,
    		matchingOptions,
    		options,
    		searchText,
    		selected,
    		input,
    		invalid,
    		open,
    		outerDiv,
    		addOptionMsg,
    		allowUserOptions,
    		autocomplete,
    		defaultDisabledTitle,
    		disabledInputTitle,
    		duplicateFunc,
    		duplicateOptionMsg,
    		duplicates,
    		id,
    		inputClass,
    		inputmode,
    		liActiveOptionClass,
    		liOptionClass,
    		liSelectedClass,
    		loading,
    		maxSelect,
    		maxSelectMsg,
    		name,
    		noMatchingOptionsMsg,
    		outerDivClass,
    		parseLabelsAsHtml,
    		pattern,
    		placeholder,
    		removeAllTitle,
    		removeBtnTitle,
    		required,
    		ulOptionsClass,
    		ulSelectedClass,
    		disabled,
    		wiggle,
    		add_option_msg_is_active,
    		window_width,
    		is_selected,
    		get_label,
    		add,
    		remove,
    		open_dropdown,
    		handle_keydown,
    		remove_all,
    		if_enter_or_space,
    		on_click_outside,
    		activeOption,
    		value,
    		autoScroll,
    		breakpoint,
    		filterFunc,
    		focusInputOnSelect,
    		resetFilterOnAdd,
    		sortSelected,
    		slots,
    		mousedown_handler_1,
    		mousedown_handler_2,
    		focus_handler,
    		blur_handler,
    		change_handler,
    		click_handler,
    		keydown_handler,
    		keyup_handler,
    		mousedown_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		touchcancel_handler,
    		touchend_handler,
    		touchmove_handler,
    		touchstart_handler,
    		onwindowresize,
    		invalid_handler,
    		mouseup_handler,
    		keydown_handler_1,
    		input1_binding,
    		input1_input_handler,
    		wiggle_1_wiggle_binding,
    		mouseup_handler_1,
    		mouseover_handler,
    		focus_handler_1,
    		mouseout_handler,
    		blur_handler_1,
    		func,
    		mouseup_handler_2,
    		mouseover_handler_1,
    		focus_handler_2,
    		mouseout_handler_1,
    		blur_handler_2,
    		div_binding,
    		$$scope
    	];
    }

    class MultiSelect extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$4,
    			create_fragment$4,
    			safe_not_equal,
    			{
    				activeIndex: 0,
    				activeOption: 50,
    				addOptionMsg: 9,
    				allowUserOptions: 10,
    				autocomplete: 11,
    				autoScroll: 52,
    				breakpoint: 53,
    				defaultDisabledTitle: 12,
    				disabled: 37,
    				disabledInputTitle: 13,
    				duplicateFunc: 14,
    				duplicateOptionMsg: 15,
    				duplicates: 16,
    				filterFunc: 54,
    				focusInputOnSelect: 55,
    				id: 17,
    				input: 5,
    				inputClass: 18,
    				inputmode: 19,
    				invalid: 6,
    				liActiveOptionClass: 20,
    				liOptionClass: 21,
    				liSelectedClass: 22,
    				loading: 23,
    				matchingOptions: 1,
    				maxSelect: 24,
    				maxSelectMsg: 25,
    				name: 26,
    				noMatchingOptionsMsg: 27,
    				open: 7,
    				options: 2,
    				outerDiv: 8,
    				outerDivClass: 28,
    				parseLabelsAsHtml: 29,
    				pattern: 30,
    				placeholder: 31,
    				removeAllTitle: 32,
    				removeBtnTitle: 33,
    				required: 34,
    				resetFilterOnAdd: 56,
    				searchText: 3,
    				selected: 4,
    				sortSelected: 57,
    				ulOptionsClass: 35,
    				ulSelectedClass: 36,
    				value: 51
    			},
    			null,
    			[-1, -1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MultiSelect",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get activeIndex() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeIndex(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activeOption() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeOption(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get addOptionMsg() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set addOptionMsg(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get allowUserOptions() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set allowUserOptions(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get autocomplete() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set autocomplete(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get autoScroll() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set autoScroll(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get breakpoint() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set breakpoint(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get defaultDisabledTitle() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set defaultDisabledTitle(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabledInputTitle() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabledInputTitle(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duplicateFunc() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duplicateFunc(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duplicateOptionMsg() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duplicateOptionMsg(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duplicates() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duplicates(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get filterFunc() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filterFunc(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focusInputOnSelect() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set focusInputOnSelect(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get input() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set input(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputClass() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputClass(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputmode() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputmode(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalid() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalid(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get liActiveOptionClass() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set liActiveOptionClass(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get liOptionClass() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set liOptionClass(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get liSelectedClass() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set liSelectedClass(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get loading() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set loading(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get matchingOptions() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set matchingOptions(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get maxSelect() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set maxSelect(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get maxSelectMsg() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set maxSelectMsg(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noMatchingOptionsMsg() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noMatchingOptionsMsg(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get open() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get options() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outerDiv() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outerDiv(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outerDivClass() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outerDivClass(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get parseLabelsAsHtml() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set parseLabelsAsHtml(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pattern() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pattern(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get removeAllTitle() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set removeAllTitle(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get removeBtnTitle() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set removeBtnTitle(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get required() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set required(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get resetFilterOnAdd() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set resetFilterOnAdd(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get searchText() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set searchText(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sortSelected() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sortSelected(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ulOptionsClass() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ulOptionsClass(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ulSelectedClass() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ulSelectedClass(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<MultiSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<MultiSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    // Firefox lacks support for scrollIntoViewIfNeeded, see
    // https://github.com/janosh/svelte-multiselect/issues/87
    // this polyfill was copied from
    // https://github.com/nuxodin/lazyfill/blob/a8e63/polyfills/Element/prototype/scrollIntoViewIfNeeded.js
    if (typeof Element !== `undefined` &&
        !Element.prototype?.scrollIntoViewIfNeeded &&
        typeof IntersectionObserver !== `undefined`) {
        Element.prototype.scrollIntoViewIfNeeded = function (centerIfNeeded = true) {
            const el = this;
            new IntersectionObserver(function ([entry]) {
                const ratio = entry.intersectionRatio;
                if (ratio < 1) {
                    const place = ratio <= 0 && centerIfNeeded ? `center` : `nearest`;
                    el.scrollIntoView({
                        block: place,
                        inline: place,
                    });
                }
                this.disconnect();
            }).observe(this);
        };
    }

    readable([
      'fun',
      'story',
      'gameplay',
      'graphics',
      'combat',
      'easy',
      'characters',
      'music',
      'world',
      'interesting',
      'simple',
      'short',
      'mechanics',
      'achievements',
      'difficulty',
      'puzzles',
      'friends',
      'fast',
      'original',
      'unique',
      'community',
      'space',
      'beautiful',
      'challenging',
      'strategy',
      'soundtrack',
      'fps',
      'funny',
      'horror',
      'dungeon',
      'shooter',
      'atmosphere',
      'crafting',
      'guns',
      'simulator',
      'upgrades',
      'zombies',
      'adventure',
      'casual',
      'monsters',
      'grinding',
      'satisfying',
      'magic',
      'deep',
      'sad',
      'platformer',
      'animation',
      'fantasy',
      'customization',
      'exploration',
      'addictive',
      'tactical',
      'polished'
    ]);

    const GameReviews = writable([]);

    /* src/components/KeywordDropdown.svelte generated by Svelte v3.53.1 */

    const { console: console_1 } = globals;

    const file$3 = "src/components/KeywordDropdown.svelte";

    function create_fragment$3(ctx) {
    	let p0;
    	let t1;
    	let multiselect0;
    	let div;
    	let updating_positives_selected;
    	let t2;
    	let br0;
    	let t3;
    	let p1;
    	let t5;
    	let multiselect1;
    	let div_1;
    	let updating_negatives_selected;
    	let t6;
    	let br1;
    	let t7;
    	let p2;
    	let t8;
    	let input0;
    	let t9;
    	let p3;
    	let t10;
    	let input1;
    	let t11;
    	let header;
    	let p5;
    	let button;
    	let p4;
    	let current;
    	let mounted;
    	let dispose;

    	function multiselect0_positives_selected_binding(value) {
    		/*multiselect0_positives_selected_binding*/ ctx[6](value);
    	}

    	let multiselect0_props = { options: /*attrs*/ ctx[4] };

    	if (/*positives_selected*/ ctx[0] !== void 0) {
    		multiselect0_props.positives_selected = /*positives_selected*/ ctx[0];
    	}

    	multiselect0 = new MultiSelect({
    			props: multiselect0_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(multiselect0, 'positives_selected', multiselect0_positives_selected_binding));
    	multiselect0.$on("change", /*change_handler*/ ctx[7]);

    	function multiselect1_negatives_selected_binding(value) {
    		/*multiselect1_negatives_selected_binding*/ ctx[8](value);
    	}

    	let multiselect1_props = { options: /*attrs*/ ctx[4] };

    	if (/*negatives_selected*/ ctx[1] !== void 0) {
    		multiselect1_props.negatives_selected = /*negatives_selected*/ ctx[1];
    	}

    	multiselect1 = new MultiSelect({
    			props: multiselect1_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(multiselect1, 'negatives_selected', multiselect1_negatives_selected_binding));
    	multiselect1.$on("change", /*change_handler_1*/ ctx[9]);

    	const block = {
    		c: function create() {
    			p0 = element("p");
    			p0.textContent = "Qualities you want?";
    			t1 = space();
    			div = element("div");
    			create_component(multiselect0.$$.fragment);
    			t2 = space();
    			br0 = element("br");
    			t3 = space();
    			p1 = element("p");
    			p1.textContent = "Qualities you don't want?";
    			t5 = space();
    			div_1 = element("div");
    			create_component(multiselect1.$$.fragment);
    			t6 = space();
    			br1 = element("br");
    			t7 = space();
    			p2 = element("p");
    			t8 = text("I care about review sentiment  \r\n    ");
    			input0 = element("input");
    			t9 = space();
    			p3 = element("p");
    			t10 = text("I care whether or not the author recommended the game\r\n    ");
    			input1 = element("input");
    			t11 = space();
    			header = element("header");
    			p5 = element("p");
    			button = element("button");
    			p4 = element("p");
    			p4.textContent = "Find Reviews";
    			attr_dev(p0, "class", "svelte-14euc0r");
    			add_location(p0, file$3, 101, 2, 2807);
    			set_style(div, "display", "contents");
    			set_style(div, "--sms-options-bg", "#333");
    			add_location(br0, file$3, 111, 2, 3243);
    			attr_dev(p1, "class", "svelte-14euc0r");
    			add_location(p1, file$3, 112, 2, 3251);
    			set_style(div_1, "display", "contents");
    			set_style(div_1, "--sms-options-bg", "#333");
    			add_location(br1, file$3, 123, 2, 3699);
    			attr_dev(input0, "type", "checkbox");
    			add_location(input0, file$3, 126, 4, 3753);
    			attr_dev(p2, "class", "svelte-14euc0r");
    			add_location(p2, file$3, 124, 2, 3707);
    			attr_dev(input1, "type", "checkbox");
    			add_location(input1, file$3, 130, 4, 3879);
    			attr_dev(p3, "class", "svelte-14euc0r");
    			add_location(p3, file$3, 128, 2, 3811);
    			attr_dev(p4, "class", "svelte-14euc0r");
    			add_location(p4, file$3, 135, 12, 4009);
    			attr_dev(button, "class", "svelte-14euc0r");
    			add_location(button, file$3, 134, 8, 3969);
    			attr_dev(p5, "class", "svelte-14euc0r");
    			add_location(p5, file$3, 133, 4, 3956);
    			attr_dev(header, "class", "svelte-14euc0r");
    			add_location(header, file$3, 132, 2, 3942);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(multiselect0, div, null);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, p1, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div_1, anchor);
    			mount_component(multiselect1, div_1, null);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, p2, anchor);
    			append_dev(p2, t8);
    			append_dev(p2, input0);
    			input0.checked = /*sentiment*/ ctx[2];
    			insert_dev(target, t9, anchor);
    			insert_dev(target, p3, anchor);
    			append_dev(p3, t10);
    			append_dev(p3, input1);
    			input1.checked = /*recommendation*/ ctx[3];
    			insert_dev(target, t11, anchor);
    			insert_dev(target, header, anchor);
    			append_dev(header, p5);
    			append_dev(p5, button);
    			append_dev(button, p4);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "change", /*input0_change_handler*/ ctx[10]),
    					listen_dev(input1, "change", /*input1_change_handler*/ ctx[11]),
    					listen_dev(button, "click", /*doPost*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const multiselect0_changes = {};

    			if (!updating_positives_selected && dirty & /*positives_selected*/ 1) {
    				updating_positives_selected = true;
    				multiselect0_changes.positives_selected = /*positives_selected*/ ctx[0];
    				add_flush_callback(() => updating_positives_selected = false);
    			}

    			multiselect0.$set(multiselect0_changes);
    			const multiselect1_changes = {};

    			if (!updating_negatives_selected && dirty & /*negatives_selected*/ 2) {
    				updating_negatives_selected = true;
    				multiselect1_changes.negatives_selected = /*negatives_selected*/ ctx[1];
    				add_flush_callback(() => updating_negatives_selected = false);
    			}

    			multiselect1.$set(multiselect1_changes);

    			if (dirty & /*sentiment*/ 4) {
    				input0.checked = /*sentiment*/ ctx[2];
    			}

    			if (dirty & /*recommendation*/ 8) {
    				input1.checked = /*recommendation*/ ctx[3];
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(multiselect0.$$.fragment, local);
    			transition_in(multiselect1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(multiselect0.$$.fragment, local);
    			transition_out(multiselect1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t1);
    			if (detaching && multiselect0) detach_dev(div);
    			destroy_component(multiselect0, detaching);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t5);
    			if (detaching && multiselect1) detach_dev(div_1);
    			destroy_component(multiselect1, detaching);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(p2);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(p3);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(header);
    			mounted = false;
    			run_all(dispose);
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

    function addOption(opt, array) {
    	array.push(opt);
    }

    function emptyArray(array) {
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('KeywordDropdown', slots, []);

    	const attrs = [
    		'fun',
    		'story',
    		'gameplay',
    		'graphics',
    		'combat',
    		'easy',
    		'characters',
    		'music',
    		'world',
    		'interesting',
    		'simple',
    		'short',
    		'mechanics',
    		'achievements',
    		'difficulty',
    		'puzzles',
    		'friends',
    		'fast',
    		'original',
    		'unique',
    		'community',
    		'space',
    		'beautiful',
    		'challenging',
    		'strategy',
    		'soundtrack',
    		'fps',
    		'funny',
    		'horror',
    		'dungeon',
    		'shooter',
    		'atmosphere',
    		'crafting',
    		'guns',
    		'simulator',
    		'upgrades',
    		'zombies',
    		'adventure',
    		'casual',
    		'monsters',
    		'grinding',
    		'satisfying',
    		'magic',
    		'deep',
    		'sad',
    		'platformer',
    		'animation',
    		'fantasy',
    		'customization',
    		'exploration',
    		'addictive',
    		'tactical',
    		'polished'
    	];

    	let positives_selected = [];
    	let negatives_selected = [];
    	let sentiment = true;
    	let recommendation = true;
    	let game_rocket_api = 'https://api.gamerocket.com/recommend';
    	let result = null;

    	async function doPost() {
    		console.log("Sending POST request to API");

    		const res = await fetch('http://3.80.214.160:8000/recommend', {
    			method: 'POST',
    			headers: { 'Content-Type': 'application/json' },
    			body: JSON.stringify({
    				"n_reviews": 5,
    				"positives": positives_selected,
    				"negatives": negatives_selected,
    				"author_recommended_game": recommendation,
    				sentiment
    			})
    		});

    		const json = await res.json();
    		console.log(json);
    		result = JSON.stringify(json);

    		// console.log(result)
    		GameReviews.update(currentFeedback => {
    			return json;
    		});
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<KeywordDropdown> was created with unknown prop '${key}'`);
    	});

    	function multiselect0_positives_selected_binding(value) {
    		positives_selected = value;
    		$$invalidate(0, positives_selected);
    	}

    	const change_handler = e => {
    		if (e.detail.type === 'add') addOption(e.detail.option, positives_selected);
    		if (e.detail.type === 'remove') positives_selected.splice(positives_selected.indexOf(e.detail.Option), 1);
    		if (e.detail.type === 'removeAll') $$invalidate(0, positives_selected = []);
    	};

    	function multiselect1_negatives_selected_binding(value) {
    		negatives_selected = value;
    		$$invalidate(1, negatives_selected);
    	}

    	const change_handler_1 = e => {
    		if (e.detail.type === 'add') addOption(e.detail.option, negatives_selected);
    		if (e.detail.type === 'remove') negatives_selected.splice(negatives_selected.indexOf(e.detail.Option), 1);
    		if (e.detail.type === 'removeAll') $$invalidate(1, negatives_selected = []);
    	};

    	function input0_change_handler() {
    		sentiment = this.checked;
    		$$invalidate(2, sentiment);
    	}

    	function input1_change_handler() {
    		recommendation = this.checked;
    		$$invalidate(3, recommendation);
    	}

    	$$self.$capture_state = () => ({
    		MultiSelect,
    		GameReviews,
    		attrs,
    		positives_selected,
    		negatives_selected,
    		sentiment,
    		recommendation,
    		game_rocket_api,
    		result,
    		addOption,
    		emptyArray,
    		doPost
    	});

    	$$self.$inject_state = $$props => {
    		if ('positives_selected' in $$props) $$invalidate(0, positives_selected = $$props.positives_selected);
    		if ('negatives_selected' in $$props) $$invalidate(1, negatives_selected = $$props.negatives_selected);
    		if ('sentiment' in $$props) $$invalidate(2, sentiment = $$props.sentiment);
    		if ('recommendation' in $$props) $$invalidate(3, recommendation = $$props.recommendation);
    		if ('game_rocket_api' in $$props) game_rocket_api = $$props.game_rocket_api;
    		if ('result' in $$props) result = $$props.result;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		positives_selected,
    		negatives_selected,
    		sentiment,
    		recommendation,
    		attrs,
    		doPost,
    		multiselect0_positives_selected_binding,
    		change_handler,
    		multiselect1_negatives_selected_binding,
    		change_handler_1,
    		input0_change_handler,
    		input1_change_handler
    	];
    }

    class KeywordDropdown extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "KeywordDropdown",
    			options,
    			id: create_fragment$3.name
    		});
    	}
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
    function scale(node, { delay = 0, duration = 400, easing = cubicOut, start = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const sd = 1 - start;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (_t, u) => `
			transform: ${transform} scale(${1 - (sd * u)});
			opacity: ${target_opacity - (od * u)}
		`
        };
    }

    /* src/components/ReviewItem.svelte generated by Svelte v3.53.1 */
    const file$2 = "src/components/ReviewItem.svelte";

    // (15:0) <Card>
    function create_default_slot(ctx) {
    	let div0;
    	let t0_value = rounded(/*review*/ ctx[0].score) + "";
    	let t0;
    	let t1;
    	let div1;
    	let a;
    	let img;
    	let img_src_value;
    	let a_href_value;
    	let t2;
    	let div2;
    	let t3_value = /*review*/ ctx[0].game_name + "";
    	let t3;
    	let t4;
    	let p;
    	let t5;
    	let br;
    	let t6;
    	let t7_value = /*review*/ ctx[0].review_text + "";
    	let t7;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");
    			a = element("a");
    			img = element("img");
    			t2 = space();
    			div2 = element("div");
    			t3 = text(t3_value);
    			t4 = space();
    			p = element("p");
    			t5 = text("Review:\n      ");
    			br = element("br");
    			t6 = space();
    			t7 = text(t7_value);
    			attr_dev(div0, "class", "num-display svelte-ujlgis");
    			add_location(div0, file$2, 15, 4, 267);
    			if (!src_url_equal(img.src, img_src_value = "steam_icon.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-ujlgis");
    			add_location(img, file$2, 19, 44, 407);
    			attr_dev(a, "href", a_href_value = steamLink(/*review*/ ctx[0].game_id));
    			add_location(a, file$2, 19, 8, 371);
    			attr_dev(div1, "class", "steam-link svelte-ujlgis");
    			add_location(div1, file$2, 18, 4, 338);
    			attr_dev(div2, "class", "game-name svelte-ujlgis");
    			add_location(div2, file$2, 21, 4, 453);
    			add_location(br, file$2, 26, 6, 564);
    			attr_dev(p, "class", "text-display");
    			add_location(p, file$2, 24, 4, 519);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, a);
    			append_dev(a, img);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, t3);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t5);
    			append_dev(p, br);
    			append_dev(p, t6);
    			append_dev(p, t7);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*review*/ 1 && t0_value !== (t0_value = rounded(/*review*/ ctx[0].score) + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*review*/ 1 && a_href_value !== (a_href_value = steamLink(/*review*/ ctx[0].game_id))) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*review*/ 1 && t3_value !== (t3_value = /*review*/ ctx[0].game_name + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*review*/ 1 && t7_value !== (t7_value = /*review*/ ctx[0].review_text + "")) set_data_dev(t7, t7_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div2);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(15:0) <Card>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let card;
    	let current;

    	card = new Card({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const card_changes = {};

    			if (dirty & /*$$scope, review*/ 3) {
    				card_changes.$$scope = { dirty, ctx };
    			}

    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
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

    function rounded(num) {
    	return Math.round(num * 100);
    }

    function steamLink(steam_id) {
    	return "https://store.steampowered.com/app/" + steam_id;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ReviewItem', slots, []);
    	let { review } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (review === undefined && !('review' in $$props || $$self.$$.bound[$$self.$$.props['review']])) {
    			console.warn("<ReviewItem> was created without expected prop 'review'");
    		}
    	});

    	const writable_props = ['review'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ReviewItem> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('review' in $$props) $$invalidate(0, review = $$props.review);
    	};

    	$$self.$capture_state = () => ({ review, Card, rounded, steamLink });

    	$$self.$inject_state = $$props => {
    		if ('review' in $$props) $$invalidate(0, review = $$props.review);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [review];
    }

    class ReviewItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { review: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ReviewItem",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get review() {
    		throw new Error("<ReviewItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set review(value) {
    		throw new Error("<ReviewItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/ReviewList.svelte generated by Svelte v3.53.1 */
    const file$1 = "src/components/ReviewList.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (7:2) {#each $GameReviews as review (review.game_id)}
    function create_each_block(key_1, ctx) {
    	let div;
    	let reviewitem;
    	let t;
    	let div_intro;
    	let div_outro;
    	let current;

    	reviewitem = new ReviewItem({
    			props: { review: /*review*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			create_component(reviewitem.$$.fragment);
    			t = space();
    			add_location(div, file$1, 7, 4, 229);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(reviewitem, div, null);
    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const reviewitem_changes = {};
    			if (dirty & /*$GameReviews*/ 1) reviewitem_changes.review = /*review*/ ctx[1];
    			reviewitem.$set(reviewitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(reviewitem.$$.fragment, local);

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);
    				div_intro = create_in_transition(div, scale, {});
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(reviewitem.$$.fragment, local);
    			if (div_intro) div_intro.invalidate();
    			div_outro = create_out_transition(div, fade, { duration: 500 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(reviewitem);
    			if (detaching && div_outro) div_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(7:2) {#each $GameReviews as review (review.game_id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let each_value = /*$GameReviews*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*review*/ ctx[1].game_id;
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
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$GameReviews*/ 1) {
    				each_value = /*$GameReviews*/ ctx[0];
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
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $GameReviews;
    	validate_store(GameReviews, 'GameReviews');
    	component_subscribe($$self, GameReviews, $$value => $$invalidate(0, $GameReviews = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ReviewList', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ReviewList> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		GameReviews,
    		fade,
    		scale,
    		ReviewItem,
    		$GameReviews
    	});

    	return [$GameReviews];
    }

    class ReviewList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ReviewList",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.53.1 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let title;
    	let t0;
    	let aboutus;
    	let t1;
    	let keyworddropdown;
    	let t2;
    	let reviewlist;
    	let current;
    	title = new Title({ $$inline: true });
    	aboutus = new AboutUs({ $$inline: true });
    	keyworddropdown = new KeywordDropdown({ $$inline: true });
    	reviewlist = new ReviewList({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(title.$$.fragment);
    			t0 = space();
    			create_component(aboutus.$$.fragment);
    			t1 = space();
    			create_component(keyworddropdown.$$.fragment);
    			t2 = space();
    			create_component(reviewlist.$$.fragment);
    			attr_dev(main, "class", "container");
    			add_location(main, file, 7, 0, 242);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(title, main, null);
    			append_dev(main, t0);
    			mount_component(aboutus, main, null);
    			append_dev(main, t1);
    			mount_component(keyworddropdown, main, null);
    			append_dev(main, t2);
    			mount_component(reviewlist, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(title.$$.fragment, local);
    			transition_in(aboutus.$$.fragment, local);
    			transition_in(keyworddropdown.$$.fragment, local);
    			transition_in(reviewlist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(title.$$.fragment, local);
    			transition_out(aboutus.$$.fragment, local);
    			transition_out(keyworddropdown.$$.fragment, local);
    			transition_out(reviewlist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(title);
    			destroy_component(aboutus);
    			destroy_component(keyworddropdown);
    			destroy_component(reviewlist);
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
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Title,
    		AboutUs,
    		KeywordDropdown,
    		ReviewList
    	});

    	return [];
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
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
