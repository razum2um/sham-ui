/**
 * Основной модуль
 * @module shamUI
 */
define( [
  "Class",
  "machina",
  "./fsm",
  "./binding",
  "./widget",
  "./packageRender"
], function( Class, machina, fsm, binding, widget, PackageRender ) {
    var ShamUI,
        WidgetWrapper,
        lastCreatedInstance = null;

    ShamUI = Class(
        /** @lends ShamUI.prototype */
        {
            /**
             * @constructs
             * @classdesc Фабрика для создания инстанцов библиотеки
             * @param {Object=} optionsArgs Опции
             * @param {Object=} optionsArgs.Fsm    Конструктор для FSM. По-умолчнию используется
             *                                     {@link module:shamUI/fsm~Fsm}
             * @param {Object=} optionsArgs.states Состояния FSM. По-умолчнию используется
             *                                    {@link module:shamUI/fsm~states}
             */
            constructor: function( optionsArgs ) {
                var options = optionsArgs || {},
                    FsmConstructor = options.Fsm || fsm.Fsm,
                    FsmStates = options.fsmStates || fsm.states;

                this.render = new machina.Fsm(
                    ( new FsmConstructor( FsmStates ) ).__proto__
                );
                lastCreatedInstance = this;
            },
            /**
             * Доступ к конечному автомату
             * type {Object}
             * @see {@link module:shamUI/fsm}
             */
            render: null,
            /**
             * Установить биндинг
             * @param {Function} fn Фукнция создающая виджеты
             */
            setBinding: function( fn ) {
                var args = [ fn, this ].concat(
                    Array.prototype.slice.call( arguments, 1 )
                );
                this.render.setBinding( binding.apply( this, args ) );
            }
        }
    );

    WidgetWrapper = Class( widget,
        {
            constructor: function() {
                this.UI = lastCreatedInstance;
                return WidgetWrapper.$super.apply( this, arguments );
            }
        }
    );

    return {
        /** Функционал для работы с классами */
        Class: Class,
        /**
         * Основной класс для создания инстансов библиотеки
         * @see ShamUI
         */
        main: ShamUI,
        /**
         * Функционал для работы с конечным атоматом рендера
         * @see {@link module:shamUI/fsm}
         */
        fsm: fsm,
        /**
         * Базовый класс виджета
         * @see {@link module:shamUI/widget}
         */
        Widget: WidgetWrapper,
        /**
         * Пакетная отрисовка виджетов
         */
        PackageRender: PackageRender
    };
} );