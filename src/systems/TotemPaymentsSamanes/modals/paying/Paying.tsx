import styles from "./paying.module.css";
import card from "../../assets/pay_card_animated.svg";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Paying: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/totemPaymentsSamanes/thanks");
    }, 5000);

    return () => clearTimeout(timer); // cleanup para evitar leaks
  }, [navigate]);

  return (
    <>
      <div className={styles.main_paying}>
        <div className={styles.txt}>
          <p className={styles.message_txt}>
            Coloque su tarjeta para procesar el pago
          </p>
        </div>
        <img className={styles.card_img} src={card} />
      </div>
    </>
  );
};

export default Paying;
