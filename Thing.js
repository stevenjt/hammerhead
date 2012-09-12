var H = (function(hammer) {

    function Thing(i, t, pos, rot, renderP, boundingB, targetPath, doPathLoop, td, isVisible, sp, targetPos) {

        this.id = i;
        this.tag = t;
        this.position = pos;
        this.originalPosition = [pos[0], pos[1]];
        this.rotation = rot;
        this.renderPolygons = renderP;
        this.boundingBox = boundingB;
        this.path = targetPath;
        this.pathLoop = doPathLoop;
        this.timeDuration = td;
		this.inScene = true;
        this.collideList = [];
		this.visible = isVisible;

        this.isHit = false;
        
		this.targetPosition = targetPos;
        if (this.targetPosition !== null) {
		    this.dx = this.targetPosition[0] - this.position[0];
		    this.dy = this.targetPosition[1] - this.position[1];
        }
        this.speed = sp;
        this.maxSpeed = 500;
		
		if (this.tag === "player") {
			this.health = 10;	
			this.maxHealth = 10;	
		} else if (this.tag === "huge") {
			this.health = 20;
			this.maxHealth = 20;	
		} else {
			this.health = 10;
			this.maxHealth = 10;
        }

        this.gunAngle = 0;

        this.getID = function() {
            return this.id;
        }

        this.getTag = function() {
            return this.tag;
        }

        this.addRotation = function(r) {
            this.rotation += r;
        }
		
		this.removeRotation = function(r) {
			this.rotation -= r;
		}

        this.getRotation = function() {
            return this.rotation;
        }

        this.addX = function(v) {
            this.position[0] += v;
        }
		
		this.removeX = function(v) {
			this.position[0] -= v;
		}

        this.addY = function(v) {
            this.position[1] += v;
        }
		
		this.removeY = function(v) {
			this.position[1] -= v;
		}

        this.getX = function() {
            return this.position[0];
        }

        this.getY = function() {
            return this.position[1];
        }

        this.reset = function(xy, rot) {
            this.position = xy;
            this.rotation = rot;
            this.targetPosition = null;

            this.inScene = true;
		
            if (this.tag === "player") {
                this.health = 10;	
                this.maxHealth = 10;	
            } else if (this.tag === "huge") {
                this.health = 20;
                this.maxHealth = 20;	
            } else {
                this.health = 10;
                this.maxHealth = 10;
            }
        }

        this.getPosition = function() {
            return this.position;
        }
        
        this.getRenderPolygons = function() {
            return this.renderPolygons;
        }

        this.getWidth = function() {
            return this.boundingBox[0];
        }

        this.getHeight = function() {
            return this.boundingBox[1];
        }
		
		this.setSpeed = function(s) {
			this.speed = s;
		}
		
		this.setTarget = function(x, y) {
			this.targetPosition = [x, y];
			this.dx = this.targetPosition[0] - this.position[0];
			this.dy = this.targetPosition[1] - this.position[1];
		}

        this.hit = function() {
            return this.isHit;
        }

        this.setGunAngle = function(g) {
            this.gunAngle = g;
        }

        this.getGunRotation = function() {
            return this.gunAngle;
        }

        this.setRenderP = function(p) {
            this.renderPolygons = p;
        }
		
		this.setAlive = function(a) {
			this.inScene = a;
		}
		
		this.isAlive = function() {
			return this.inScene;
		}

		this.setVisible = function(v) {
			this.visible = v;
		}
		
		this.damage = function(h) {
			this.health -= h;

			
			if (this.health === 0) {

                if (this.tag === "player") {
                    this.position = [40000, 40000];
                    H.f("You're dead");
                    //H.RS();

				    this.setAlive(false);
                } else {
                    H.eL--;
                    this.position = [40000, 40000];
				    this.setAlive(false);

                    if (H.eL === 0) {
                        H.f("All 13 ships destroyed!");
                    }

                }
			}
		}

        this.collide = function(otherThing) {

            if (this.getTag() === "event" && otherThing.getTag() === "player") {


                if (this.getID() === "Door5") {
                    H.warp();
                }

               // H.listOfThings[3].addX(5);
                return false;
            }

            for (var i = 0; i < this.collideList.length; i++) {

                if (this.collideList[i] === otherThing.getID()) {
                    return false;
                }

            }

            this.isHit = true;

            if (this.tag === "bullet" && otherThing.getTag() !== "event") {
				if (otherThing.getTag() === "enemy" || otherThing.getTag() === "huge") {
					
            	    otherThing.damage(1);
                }

				if (otherThing.getTag() !== "player") {
					this.setAlive(false);
                }
					
			}

            if (this.tag === "bullet2" && otherThing.getTag() !== "event") {
				if (otherThing.getTag() === "player") {
					
            	    otherThing.damage(1);
                }

				if (otherThing.getTag() !== "enemy" && otherThing.getTag() !== "huge") {
					this.setAlive(false);
                }
					
			}


        };

        this.uncollide = function(otherThing) {

            if (this.collideList.length !== 0) {

                for (var i = 0; i < this.collideList.length; i++) {

                    if (this.collideList[i] === otherThing.getID()) {
                        this.collideList = this.collideList.splice(i + 1, 1);

                        this.isHit = false;

                    }

                }

            }

        }

        var prev = 0;
        var prev2 = 0;

        this.update = function(delta) {

            if (this.timeDuration) {
                this.timeDuration -= delta;

                if (this.timeDuration < 0) {
					this.inScene = false;
                    return false;
                }

            }

               if (this.getTag() === "huge") {


                    if (H.gDi(H.listOfThings[0].getX(), H.listOfThings[0].getY(), this.getX(), this.getY()) < (5800)) {
                        if (prev2 > 2.00) {
                        var p = [[1, 6, [[-20,-7.6378178], [-20,12.362183], [50,2.3621822], ]]];

                           H.listOfThings.push(new hammer.Thing("bullet", "bullet2", [this.getX(),this.getY()], this.getRotation(), p, [50, 50], false, false, 5, true, 2.4, [H.listOfThings[0].getX(), H.listOfThings[0].getY()]));


                            prev2 = 0;
                        }
                        prev2 += (1 * delta);


                    }
                }

			if (this.targetPosition !== null) {

                if (this.getTag() === "bullet2") {


                }

                this.position[0] += (this.dx * this.speed * delta);

                if (this.tag !== "bullet" && this.tag !== "bullet2") {
                    for (var c = 0; c < H.listOfThings.length; c++) {
                        if (H.listOfThings[c].getTag() !== "event" && H.listOfThings[c].getTag() !== "bullet2") {
                            if (H.cC(this, H.listOfThings[c])) {

                                this.position[0] -= (this.dx * this.speed * delta);
                            }
                        }
                    }
                }

                this.position[1] += (this.dy * this.speed * delta);

                if (this.tag !== "bullet" && this.tag !== "bullet2") {
                for (var c = 0; c < H.listOfThings.length; c++) {
                    if (H.listOfThings[c].getTag() !== "event" && H.listOfThings[c].getTag() !== "bullet2") {
                        if (H.cC(this, H.listOfThings[c])) {
                                this.position[1] -= (this.dy * this.speed * delta);
                        }
                    }
                }
                }

                
                if (this.getTag() === "enemy") {


                    if (H.gDi(H.listOfThings[0].getX(), H.listOfThings[0].getY(), this.getX(), this.getY()) < (2800)) {
                        if (prev > 3.00) {
                        var p = [[1, 6, [[-20,-7.6378178], [-20,12.362183], [50,2.3621822], ]]];

                           H.listOfThings.push(new hammer.Thing("bullet", "bullet2", [this.getX(),this.getY()], this.getRotation(), p, [50, 50], false, false, 5, true, 1.8, [H.listOfThings[0].getX(), H.listOfThings[0].getY()]));


                            prev = 0;
                        }
                        prev += (1 * delta);


                    }
                }


            }                

            if (this.tag === "enemy") {

                if (H.gDi(H.listOfThings[0].getX(), H.listOfThings[0].getY(), this.getX(), this.getY()) < (3000)) {

                this.setSpeed(0.9);
                this.setTarget(H.listOfThings[0].getX(), H.listOfThings[0].getY());
                }
            }

            if (this.tag !== "render") {

            }

            return true;
        }
		
        this.render = function(context, cameraX, cameraY , cameraZ) {
			
			if (this.visible) {
			
            context.save();

            context.translate((cameraX + this.position[0]), (cameraY + this.position[1]));
            context.rotate(Math.PI/180 * this.rotation);

            for (var q = 0; q < this.renderPolygons.length; q++) {

                var c = this.renderPolygons[q];

                if (c[4] === "BBox") {
                    this.cv = c;
                } else {

                if (c[4] === "GUN") {

                    context.restore();
                    context.save();
                    context.translate((cameraX + this.position[0]), (cameraY + this.position[1]));
                    context.rotate(Math.PI/180 * this.gunAngle);
                    context.translate(-90, 0);
                }

                if (c[0] === 0) {
                    context.save();
                    context.fillStyle = H.c[c[1]];
                    context.translate(c[3][0], c[3][1]);
                    context.fillRect(0, 0, c[2][0], c[2][1]);
                    context.restore();
                } else if (c[0] === 1) {

                    if (c[3] === "flame" ) {
                        if (H.getUp()) {
                        context.fillStyle = H.c[c[1]];
                        var p = c[2];
                        context.beginPath();
                        context.moveTo(p[0], p[1]);

                        for (var d = 0; d < p.length; d++) {
                            context.lineTo(-p[d][0], p[d][1]);
                        }

                        context.closePath();
                        context.fill();
                        }


                    } else {
                        context.fillStyle = H.c[c[1]];
                        var p = c[2];
                        context.beginPath();
                        context.moveTo(p[0], p[1]);

                        for (var d = 0; d < p.length; d++) {
                            context.lineTo(-p[d][0], p[d][1]);
                        }

                        context.closePath();
                        context.fill();

                    }

                }
                if (c[4] === "GUN") {

                    context.restore();

                    context.save();
            		context.translate((cameraX + this.position[0]), (cameraY + this.position[1]));
            		context.rotate(Math.PI/180 * this.rotation);
                }
                }

            }
			


            /*
            if (this.renderPolygons[0] === 0) {
                context.fillRect(-(this.renderPolygons[1][0] / 2), -(this.renderPolygons[1][1] / 2), this.renderPolygons[1][0], this.renderPolygons[1][1]);
            } else if (this.renderPolygons[0] === 1) {

                context.beginPath();
                context.moveTo(renderP[0][0], renderP[0][1]);

                for (var d = 0; d < renderP.length; d++) {

                    context.lineTo(renderP[d][0], renderP[d][1]);
                }

                context.closePath();
                context.fill();

            }
            */

            context.restore();
			
			if (H.gD()) {
			// BOUNDING BOX
			context.fillStyle = "red";
			context.fillRect(cameraX + this.position[0], cameraY + this.position[1], this.getWidth(), this.getHeight());
			

		    }

            if (this.getTag() === "player" || this.getTag() === "enemy" || this.getTag() === "huge") {
			// HEALTH
            context.font = "bold 52px sans-serif";
            context.fillStyle = 'yellow';

			//context.fillText(this.health, cameraX + this.position[0], cameraY + this.position[1] + 150);
            var per = ((this.health / this.maxHealth) * 100) * 2;
            context.fillStyle = 'black';
            context.fillRect(cameraX + this.position[0] - this.getWidth(), cameraY + this.position[1] + 150, 200, 50);
            context.fillStyle = 'green';
            context.fillRect(cameraX + this.position[0] - this.getWidth(), cameraY + this.position[1] + 150, per, 50);

         }
        }
		
	}

    }   

    hammer.Thing = Thing;

    return hammer;

}(H || {}));
