function Welcome(props){     
    return <div id="welcome_popup" className="welcome_popup">
        <div class="box_container">
            <div class="box">
                <div class="box_body">
                    <div class="img">
                        {(() => {
                            switch (props.lang) {
                                case "DE":
                                    return <p class="gift_text"><span>"Willkommen</span><span>Kostenlos 100 Karotten!</span></p>
                                case "ES":
                                    return <p class="gift_text"><span>Bienvenido</span><span>100 zanahorias gratis!</span></p>
                                case "FR":
                                    return <p class="gift_text"><span>Bienvenue</span><span>100 carottes gratuites!</span></p>
                                case "IT":
                                    return <p class="gift_text"><span>Benvenuto</span><span>100 carote gratis!</span></p>
                                case "RO":
                                    return <p class="gift_text"><span>Bine ai venit</span><span>100 de morcovi gratis!</span></p>
                                case "ENG":
                                default:
                                    return <p class="gift_text"><span>Welcome</span><span>Free 100 carrots!</span></p>
                            } 
                        })()}
                    </div>
                    <div class="box_lid">
                        <div class="box_bowtie"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}
export default Welcome