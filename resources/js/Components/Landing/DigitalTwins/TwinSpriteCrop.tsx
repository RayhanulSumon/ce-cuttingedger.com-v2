import React, { memo } from 'react';
import { DigitalTwinModel, TWIN_MODELS_SPRITE, TWIN_PIECES_SPRITE, TWIN_Y0, TWIN_Y1, TwinPosePreset } from './twins';

/** One rectangular region of a sprite sheet, drawn as a self-sizing SVG. */
function SpriteCrop({
    href,
    sheetWidth,
    sheetHeight,
    x,
    y,
    width,
    height,
    className,
    style,
}: {
    href: string;
    sheetWidth: number;
    sheetHeight: number;
    x: number;
    y: number;
    width: number;
    height: number;
    className: string;
    style?: React.CSSProperties;
}) {
    const viewBox = `${x} ${y} ${width} ${height}`;

    return (
        <svg viewBox={viewBox} className={`block select-none ${className}`} style={style} aria-hidden="true">
            <svg x={x} y={y} width={width} height={height} viewBox={viewBox}>
                <image href={href} width={sheetWidth} height={sheetHeight} />
            </svg>
        </svg>
    );
}

/**
 * Renders a Digital Twin model or pose:
 * 1. If `pose?.imageUrl` is uploaded for that specific pose, renders the dedicated pose image.
 * 2. If `twin.runwayImage` / `twin.hiResImage` is uploaded from the Admin Panel, renders that model image
 *    with automatic smart-crop framing for poses that do not have a separate pose upload.
 * 3. Otherwise falls back to cropping from the default Digital Twins sprite sheet.
 */
export const TwinSpriteCrop = memo(function TwinSpriteCrop({
    twin,
    pose,
    className = 'h-full w-full',
}: {
    twin: DigitalTwinModel;
    pose?: TwinPosePreset;
    className?: string;
}) {
    if (pose?.imageUrl) {
        return (
            <img
                src={pose.imageUrl}
                alt={`${twin.name} — ${pose.title}`}
                decoding="async"
                draggable={false}
                className={`block select-none object-contain ${className}`}
            />
        );
    }

    const uploadedImage = pose ? (twin.hiResImage || twin.runwayImage) : (twin.runwayImage || twin.hiResImage);

    if (uploadedImage) {
        const aspect = twin.aspectRatio && twin.aspectRatio > 0 ? twin.aspectRatio : 0.36;
        const baseW = 1000 * aspect;
        const baseH = 1000;
        const yStart = pose ? pose.yStartFrac * baseH : 0;
        const yEnd = pose ? pose.yEndFrac * baseH : baseH;
        const padX = pose?.xPadFrac ? baseW * pose.xPadFrac : 0;
        const transforms = [pose?.mirror ? 'scaleX(-1)' : '', pose?.tiltDeg ? `rotate(${pose.tiltDeg}deg)` : ''].filter(Boolean);

        return (
            <SpriteCrop
                href={uploadedImage}
                sheetWidth={baseW}
                sheetHeight={baseH}
                x={-padX}
                y={yStart}
                width={baseW + padX * 2}
                height={Math.max(120, yEnd - yStart)}
                className={className}
                style={transforms.length ? { transform: transforms.join(' ') } : undefined}
            />
        );
    }

    const fullWidth = Math.max(40, (twin.x1 || 176) - (twin.x0 || 12));
    const fullHeight = TWIN_Y1 - TWIN_Y0;
    const yStart = TWIN_Y0 + (pose ? pose.yStartFrac * fullHeight : 0);
    const yEnd = TWIN_Y0 + (pose ? pose.yEndFrac * fullHeight : fullHeight);
    const padX = pose?.xPadFrac ? fullWidth * pose.xPadFrac : 0;

    const transforms = [pose?.mirror ? 'scaleX(-1)' : '', pose?.tiltDeg ? `rotate(${pose.tiltDeg}deg)` : ''].filter(Boolean);

    return (
        <SpriteCrop
            href={TWIN_MODELS_SPRITE}
            sheetWidth={960}
            sheetHeight={540}
            x={(twin.x0 || 12) - padX}
            y={yStart}
            width={fullWidth + padX * 2}
            height={Math.max(60, yEnd - yStart)}
            className={className}
            style={transforms.length ? { transform: transforms.join(' ') } : undefined}
        />
    );
});

/** A garment cut from the Digital Twins pieces sheet. `box` is `[x0, x1, y0, y1]`. */
export function PieceSpriteCrop({
    box,
    className = 'h-full w-full',
}: {
    box: [number, number, number, number];
    className?: string;
}) {
    const [x0, x1, y0, y1] = box;

    return (
        <SpriteCrop
            href={TWIN_PIECES_SPRITE}
            sheetWidth={960}
            sheetHeight={720}
            x={x0}
            y={y0}
            width={x1 - x0}
            height={y1 - y0}
            className={className}
        />
    );
}
