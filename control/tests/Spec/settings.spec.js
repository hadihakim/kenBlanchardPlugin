describe('Settings Controller Tests', function() {
    let settings = {};

    describe('Settings Operations', function() {
        it("init settings", (done) => {
            Settings.get((err, resp) => {
                expect(Object.keys(resp).length > 0).toBeTrue();
                settings = resp;
                done();
            });
        });
    })

    describe('Sections Operations', function() {

        // set Timeout before each call
        beforeEach(done => setTimeout(() => done(), 100));

        let section = new Section({ "title": "Courses" });

        it('Add a new Section', (done) => {
            Settings.addSection(section, (error, response) => {
                section.id = response.id;
                expect(error).toEqual(null);
                Settings.get((err, resp) => {
                    expect(resp.sections.find(sect => sect.id == section.id)).toBeDefined()
                    settings = resp;
                    done();
                })
            })
        });

        it('Update Section', (done) => {
            section.title = "Videos";
            Settings.updateSection(section.id, section, (error, response) => {
                expect(error).toEqual(null);
                Settings.get((err, resp) => {
                    let item = resp.sections.find(sect => sect.id == section.id)
                    expect(item.title).toEqual("Videos");
                    settings = resp;
                    done();
                })
            })
        });

        it('Set Section inactive', (done) => {
            Settings.isActiveSection(section.id, false, (error, response) => {
                expect(error).toEqual(null);
                Settings.get((err, resp) => {
                    let item = resp.sections.find(sect => sect.id == section.id)
                    expect(item.isActive).toEqual(false);
                    settings = resp;
                    done();
                })
            })
        });

        it('Delete Section', (done) => {
            Settings.deleteSection(section.id, (error, response) => {
                expect(error).toEqual(null);
                Settings.get((err, resp) => {
                    expect(resp.sections.length).toEqual(settings.sections.length - 1)
                    settings = resp;
                    done();
                })
            })
        });

    });

    describe('Topics Operations', function() {

        // set Timeout before each call
        beforeEach(done => setTimeout(() => done(), 100));

        let topic = new Topic({
            "title": "Coaching",
            "tag": "lms_coaching",
            "isTrending": false,
        });

        it('Add a new Topic', (done) => {
            Settings.addTopic(topic, (error, response) => {
                topic.id = response.id;
                expect(error).toEqual(null);
                Settings.get((err, resp) => {
                    expect(resp.topics.length).toEqual(settings.topics.length + 1)
                    settings = resp;
                    done();
                })
            })
        });

        it('Update Topic', (done) => {
            topic.title = "Mentor";
            Settings.updateTopic(topic.id, topic, (error, response) => {
                expect(error).toEqual(null);
                Settings.get((err, resp) => {
                    let item = resp.topics.find(sect => sect.id == topic.id)
                    expect(item.title).toEqual("Mentor");
                    settings = resp;
                    done();
                })
            })
        });

        it('Set Topic trending', (done) => {
            Settings.isTrendingTopic(topic.id, true, (error, response) => {
                expect(error).toEqual(null);
                Settings.get((err, resp) => {
                    let item = resp.topics.find(sect => sect.id == topic.id)
                    expect(item.isTrending).toEqual(true);
                    settings = resp;
                    done();
                })
            })
        });

        it('Delete Topic', (done) => {
            Settings.deleteTopic(topic.id, (error, response) => {
                expect(error).toEqual(null);
                Settings.get((err, resp) => {
                    expect(resp.topics.length).toEqual(settings.topics.length - 1)
                    settings = resp;
                    done();
                })
            })
        });

    });

    describe('Badges Operations', function() {

        // set Timeout before each call
        beforeEach(done => setTimeout(() => done(), 100));

        let badge = new Badge({
            "title": "Comitted",
            "tag": "lms_committed",
            "assetsNeeded": 4,
        });

        it('Add a new Badge', (done) => {
            Settings.addBadge(badge, (error, response) => {
                badge.id = response.id;
                expect(error).toEqual(null);
                Settings.get((err, resp) => {
                    expect(resp.badges.length).toEqual(settings.badges.length + 1)
                    settings = resp;
                    done();
                })
            })
        });

        it('Update Badge', (done) => {
            badge.title = "Newbie";
            Settings.updateBadge(badge.id, badge, (error, response) => {
                expect(error).toEqual(null);
                Settings.get((err, resp) => {
                    let item = resp.badges.find(sect => sect.id == badge.id)
                    expect(item.title).toEqual("Newbie");
                    settings = resp;
                    done();
                })
            })
        });

        it('Delete Badge', (done) => {
            Settings.deleteBadge(badge.id, (error, response) => {
                expect(error).toEqual(null);
                Settings.get((err, resp) => {
                    expect(resp.badges.length).toEqual(settings.badges.length - 1)
                    settings = resp;
                    done();
                })
            })
        });

    });

    describe('Assessments Operations', function() {

        // set Timeout before each call
        beforeEach(done => setTimeout(() => done(), 100));

        let assessmentsGroup = new AssessmentsGroup({
            "title": "Self management",
            "assesstments": [{
                "id": "d97eb816-0fca-11e7-adc3-124a75f7d45",
                "title": "Confidence",
                "InstanceId": "c67eb816-0fca-11e7-adc3-124a75f7ddd",
                "rule": [{
                    "result_title": "Low Confidence",
                    "min": 0,
                    "max": 7,
                    "recomendation_instanceId": "00000000-0fca-11e7-adc3-124a75f7ddd"
                }]
            }]
        });

        it('Add a new Assessments Group', (done) => {
            Settings.addAssessmentsGroup(assessmentsGroup, (error, response) => {
                assessmentsGroup.id = response.id;
                expect(error).toEqual(null);
                Settings.get((err, resp) => {
                    expect(resp.assessmentsGroups.length).toEqual(settings.assessmentsGroups.length + 1)
                    settings = resp;
                    done();
                })
            })
        });

        it('Update Assessments Group', (done) => {
            assessmentsGroup.title = "Confidence";
            Settings.updateAssessmentsGroup(assessmentsGroup.id, assessmentsGroup, (error, response) => {
                expect(error).toEqual(null);
                Settings.get((err, resp) => {
                    let item = resp.assessmentsGroups.find(sect => sect.id == assessmentsGroup.id)
                    expect(item.title).toEqual("Confidence");
                    settings = resp;
                    done();
                })
            })
        });

        it('Delete Assessments Group', (done) => {
            Settings.deleteAssessmentsGroup(assessmentsGroup.id, (error, response) => {
                expect(error).toEqual(null);
                Settings.get((err, resp) => {
                    expect(resp.assessmentsGroups.length).toEqual(settings.assessmentsGroups.length - 1)
                    settings = resp;
                    done();
                })
            })
        });

    });

});