import Styled from 'styled-components'

export default Styled.span`
            font-size: ${({ size }) => size};
            font-weight: ${({ weight }) => weight ? weight : "normal"};
            color: ${({ color }) => color};
            letter-spacing: ${({ spacing }) => spacing};
            border-bottom: ${({ underline }) => underline ? `thin solid ${underline}` : "none"};
            margin-right: ${({ margin }) => margin};
            text-transform: ${({ transform }) => transform};
            width: ${({ width }) => width};
        `

        //          word-break: break-all;