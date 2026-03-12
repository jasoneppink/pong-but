# Pong, But...

![Gameplay](gameplay.gif)

Pong, But... is a WarioWare-style adaptation of the classic 1972 arcade Pong. On each serve, players encounter a randomly-chosen variation of Pong. Variations can include shrinking paddles, fading balls, inverted input, and changed bounce behaviors. The core challenge of the game is to quickly understand the variation and adapt your gameplay accordingly.

The game is designed to serve as a collective class project that results in a fully-playable game in as few as 3 weeks. Students follow along as we construct a close, digital recreation of Pong. During this part, care is taken to simulate the original arcade as closely as possible, thanks to Dr. Hugo R. Holden’s 106-page analysis of Pong’s board logic, [ATARI PONG E circuit analysis & lawn tennis: building a digital video game with 74 series TTL IC’s](https://www.pong-story.com/LAWN_TENNIS.pdf). This includes faithfully recreating the paddle bounce behavior, increasing the ball speed as a rally continues, and incorporating recordings of original sound effects. Liberties are taken with font, timing, and (optionally) player input.

Once the game is sufficiently playable, students are tasked with brainstorming 50 ideas for variations. The code we’ve written is intentionally flexible enough that variation ideas easily emerge from their affordances. The spare visual vocabulary of Pong helps focus students on gameplay.

I pick their best ideas, we hold a draft, and students work to implement their chosen variations. As students finish each variation, I fold it into the final game.

Optional custom knob-based controllers allow students to understand how different input systems change gameplay.

Context:
First-semester coding class aimed at games and animation students

Basic Schedule:
*   Week 1:
    *   [Pt 1: ball](https://github.com/jasoneppink/pong-but/blob/main/sketches/1_ball.js)
    *   [Pt 2: paddles](https://github.com/jasoneppink/pong-but/blob/main/sketches/2_paddles.js)
    *   [Pt 3: game, court, score](https://github.com/jasoneppink/pong-but/blob/main/sketches/3_game_court_score.js)
    *   [Pt 4: states](https://github.com/jasoneppink/pong-but/blob/main/sketches/4_states.js)
    *   [Pt 5: font, sound](https://github.com/jasoneppink/pong-but/blob/main/sketches/5_font_sound.js)
        
*   Week 2:
    *   [Pt 6: advanced ball](https://github.com/jasoneppink/pong-but/blob/main/sketches/6_advanced_ball.js)
    *   [Pt 7: title, serve](https://github.com/jasoneppink/pong-but/blob/main/sketches/7_title_serve.js)
        
*   Week 3:
    *   [Pt 8: variations](https://github.com/jasoneppink/pong-but/blob/main/sketches/8_variations.js)
    *   [Pt 9: controllers](https://github.com/jasoneppink/pong-but/blob/main/sketches/9_controllers.js)

Topics:
*   Classes and inheritance
*   Input affordances (optional)

Materials for controller:
*   2x [Arduino Nano Everys](https://www.digikey.com/en/products/detail/arduino/ABX00028/10239971)
*   2x [enclosures](https://www.digikey.com/en/products/detail/rose-enclosures/010610030/2164028)
*   2x [knobs](https://www.aliexpress.us/item/2251832437890364.html)
*   2x [10K ohm linear potentiometers](https://www.amazon.com/dp/B0CZ75MLQD)
*   2x [small buttons](https://www.digikey.com/en/products/detail/e-switch/PS1040ARED/53842)
*   2x [PG9 cable glands](https://www.amazon.com/dp/B0DCJHYN1V)
*   2x [10ft micro USB to USB A cables](https://www.amazon.com/dp/B08HN6YTRN)
*   [Mini PC](https://www.amazon.com/dp/B0DPFFPFK4) or Raspberry Pi
