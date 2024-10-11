import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import '../css/home.css';

export default function Home() {
    return (
        <>  
            <Container fluid className="banner-section">
                <Container>
                    <Row>
                        <Col className="col-md-7 d-flex align-items-center">
                            <div class="text-white">
                                <h1>Stream. Book. Enjoy.</h1>
                                <h3>
                                   "Catch the latest blockbusters, hidden gems, and timeless classics, all in one place!"
                                </h3>
                            </div>
                        </Col>
                        <Col className="col-md-5">
                            <div className="banner-image-con">
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Container>
        </>
    );
}
