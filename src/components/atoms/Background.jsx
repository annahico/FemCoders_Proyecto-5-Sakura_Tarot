import backgroundImg from '../../assets/images/Background.png';

export const Background = () => {
    return (
        <div className="z-0 w-full h-full bg-size-cover">
            <img src={backgroundImg} alt="pink sakura background"
            className="z-0 w-full h-full object-cover min-h-screen min-w-screen fixed" />
        </div>
    )
}