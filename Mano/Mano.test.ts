import {Mano} from './Mano';
import {Canvas} from "./Global/Canvas";
import {Graphic} from "./Graphic/Graphic";
import {ContextChangeEvent} from "./Event/ContextChangeEvent";

describe('Mano 类', () => {
    let mano: Mano;
    let canvasMock: jest.Mocked<Canvas>;
    let graphicMock: jest.Mocked<Graphic>;

    beforeEach(() => {
        // 创建Mano实例
        mano = new Mano();

        // 为Canvas和Graphic创建mock对象
        canvasMock = new Canvas() as unknown as jest.Mocked<Canvas>;
        graphicMock = new Graphic() as unknown as jest.Mocked<Graphic>;

        // 配置Canvas和Graphic mock对象的行为
        canvasMock.canvasOptions = {width: 500, height: 500, enableFPS: false};
        graphicMock.style = {setProperty: jest.fn()};
    });

    test('appendChild 方法 - 添加Canvas实例', () => {
        mano.appendChild(canvasMock);

        expect(mano.canvas).toBe(canvasMock);
        expect(mano.style.height).toBe("500px");
        expect(mano.style.width).toBe("500px");
        expect(ContextChangeEvent.prototype.constructor).toHaveBeenCalledTimes(1);
        expect(canvasMock.dispatchEvent).toHaveBeenCalledTimes(1);
    });

    test('appendChild 方法 - 添加Graphic实例', () => {
        mano.appendChild(graphicMock);

        expect(mano.graphic).toBe(graphicMock);
        expect(graphicMock.style.setProperty).toHaveBeenNthCalledWith(0, 'height', '500px');
        expect(graphicMock.style.setProperty).toHaveBeenNthCalledWith(1, 'width', '500px');
        expect(ContextChangeEvent.prototype.constructor).toHaveBeenCalledTimes(1);
        expect(canvasMock.dispatchEvent).toHaveBeenCalledTimes(1);
    });

    test('removeChild 方法 - 移除Canvas实例', () => {
        mano.canvas = canvasMock;
        mano.removeChild(canvasMock);

        expect(mano.canvas).toBe(null);
        expect(ContextChangeEvent.prototype.constructor).toHaveBeenCalledTimes(1);
        expect(canvasMock.dispatchEvent).toHaveBeenCalledTimes(1);
    });

    test('removeChild 方法 - 移除Graphic实例', () => {
        mano.graphic = graphicMock;
        mano.removeChild(graphicMock);

        expect(mano.graphic).toBe(null);
        expect(ContextChangeEvent.prototype.constructor).toHaveBeenCalledTimes(1);
        expect(canvasMock.dispatchEvent).toHaveBeenCalledTimes(1);
    });
});

export {}