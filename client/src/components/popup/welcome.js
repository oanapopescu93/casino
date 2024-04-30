function Welcome(props){     
    return <div id="welcome_popup" className="welcome_popup">
        <div className="box_container">
            <div className="box">
                <div className="box_body">
                    <div className="img">
                        {(() => {
                            switch (props.lang) {
                                case "DE":
                                    return <p className="gift_text"><span>"Willkommen</span><span>Kostenlos 100 Karotten!</span></p>
                                case "ES":
                                    return <p className="gift_text"><span>Bienvenido</span><span>100 zanahorias gratis!</span></p>
                                case "FR":
                                    return <p className="gift_text"><span>Bienvenue</span><span>100 carottes gratuites!</span></p>
                                case "IT":
                                    return <p className="gift_text"><span>Benvenuto</span><span>100 carote gratis!</span></p>
                                case "RO":
                                    return <p className="gift_text"><span>Bine ai venit</span><span>100 de morcovi gratis!</span></p>
                                case "ENG":
                                default:
                                    return <p className="gift_text"><span>Welcome</span><span>Free 100 carrots!</span></p>
                            } 
                        })()}
                    </div>
                    <div className="box_lid">
                        <div className="box_bowtie"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}
export default Welcome