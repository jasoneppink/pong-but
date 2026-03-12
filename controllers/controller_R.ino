const int potPin = A0;
int potVal = 0;

const int buttonPin = 2;
int buttonVal = 0;
int prevButtonVal = 0;

//smoothing code via https://docs.arduino.cc/built-in-examples/analog/Smoothing/
const int numReadings = 5;
int readings[numReadings];  // the readings from the analog input
int readIndex = 0;          // the index of the current reading
int total = 0;              // the running total
int average = 0;            // the average

void setup() {
  pinMode(buttonPin, INPUT);
  Serial.begin(115200);
  // initialize all the readings to 0:
  for (int thisReading = 0; thisReading < numReadings; thisReading++) {
    readings[thisReading] = 0;
  }
}

void loop() {
  //only output button information if button is pressed
  buttonVal = digitalRead(2);
  if(buttonVal == 1 && prevButtonVal == 0){
    Serial.println("RB1");
  }
  prevButtonVal = buttonVal;

  // subtract the last reading:
  total = total - readings[readIndex];
  // read from the sensor:
  // (pot gives value between 0 and 1023; We want 152=0, 521=240, 872 = 480, so we can normalize to get between 0 and 480)
  //potVal = analogRead(potPin) - 272;
  potVal = floor((analogRead(potPin) - 152) * 0.6666666);
  if(potVal < 0) {
    potVal = 0;
  } else if(potVal > 480){
    potVal = 480;
  }
  readings[readIndex] = potVal;
  // add the reading to the total:
  total = total + readings[readIndex];
  // advance to the next position in the array:
  readIndex = readIndex + 1;

  // if we're at the end of the array...
  if (readIndex >= numReadings) {
    // ...wrap around to the beginning:
    readIndex = 0;
  }

  // calculate the average:
  average = floor(total / numReadings);

  Serial.println("RP" + String(average));
  delay(10);
}
