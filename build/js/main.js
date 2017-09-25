
initBlackSea();

function initBlackSea() {
    var width = 1305,
        height = 372,
        svg = d3.select('#years-trip').append('svg').attr({
            'width': width,
            'height': height
        }),
        g,
        ports,
        intervals,
        boat,
        boatSpeed = 0.43, // в узлах=)
        direction = -1,
        click = true,
        lastClickIndex,
        startPort = 0,
        atLength;

    svg.append("image")
        .attr("xlink:href", '/images/graph_bg.png')
        .attr("width", width)
        .attr("height",height);
    g = svg.append('g');

    window.onload = function () {

        // Загружаем карту
        loadBlackSeaData('blacksea.json',
            function (res) {
                ports = res['ports'];
                intervals = res['intervals'];

                // Читаем текущего историю порта
                showlogBook(ports[0]);

                // Отмечаем порты на карте
                markPorts(ports);

                // Запускаем волны
                generateWaves(intervals);

                //Строим кораблик
                createBoat('../images/boat.png');

            }, function () {
                alert('Ошибка при загрузке данных')
            }
        );

    };

    function loadBlackSeaData(filePath, success, error) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    if (success)
                        success(JSON.parse(xhr.responseText));
                } else {
                    if (error)
                        error(xhr);
                }
            }
        };
        xhr.open('GET', filePath, true);
        xhr.send();
    }

    function generateWaves(data) {
        data.forEach(function (i) {
            g.append('path')
                .attr({
                    'class': 'wave',
                    'id': i.id,
                    'd': i.d
                });
        });
    }

    function markPorts(data) {
        data.forEach(function (i) {
            // Маркер
            var marker = g.append('g')
                .attr({'data-index': i.index,
                    'class': i.index == 0?'marker active':'marker'});

            marker.append('circle')
                .attr({
                    'cx': +i.x + 10,
                    'cy': +i.y + 10,
                    'r': 11,
                    'index': i.index})
                .on('click', function () {
                    checkClick(i.index);
                });

            // Лейбл
            var label = marker.append('g')
                .attr({'transform': 'translate(' + (+i.x - 25) + ', ' + (+i.y + 34) + ')'});
            label.append('path')
                .attr({'d': 'M6.539,0.000 L61.462,0.000 C65.073,0.000 68.000,3.053 68.000,6.819 L68.000,23.182 C68.000,26.948 65.073,30.000 61.462,30.000 L6.539,30.000 C2.927,30.000 0.000,26.948 0.000,23.182 L0.000,6.819 C0.000,3.053 2.927,0.000 6.539,0.000 Z'});
            // Текст
            label.append('text')
                .text(i.name)
                .attr({
                    'class': 'text',
                    'transform': 'translate(34, 22)'});

        });
    }

    function createBoat(image) {
        boat = g.append('g')
            .attr('transform', 'translate(162, 270)');

        boat.append('svg:image')
            .attr({
                'xlink:href': image,
                x: -30,
                y: -30,
                width: 63,
                height: 41
            });
    }

    function swim(index) {
        var path,
            curSpeed;

        // Плыть вперед
        if (startPort < index) {

            direction = -1;
            path = d3.select('#interval-' + startPort).node();
            curSpeed = calcSpeed(path);

            boat.transition()
                .ease('linear')
                .duration(curSpeed)
                .attrTween('transform', translateAlong(path));

            setTimeout(function () {
                showlogBook(ports[startPort]);
            }, curSpeed);

            startPort = +startPort + 1;
        }

        // Плыть назад
        else if (startPort > index) {

            direction = 1;
            path = d3.select('#interval-' + (+startPort - 1)).node();
            curSpeed = calcSpeed(path);

            boat.transition()
                .ease('linear')
                .duration(curSpeed)
                .attrTween('transform', translateAlong(path));

            setTimeout(function () {
                showlogBook(ports[startPort]);
            }, curSpeed);

            startPort = +startPort - 1;
        }

        // Сбросить якорь после долгого плаванья
        if (startPort != index) {
            setTimeout(function () {
                swim(index);
                click = false;
            }, curSpeed);
        }
        else {
            setTimeout(function () {
                if (lastClickIndex) {
                    swim(lastClickIndex)
                }
            }, curSpeed);
        }
    }

    function calcSpeed(interval) {
        return interval.getTotalLength() / boatSpeed;
    }

    function translateAlong(path) {
        var l = path.getTotalLength();

        return function (d, i, a) {
            return function (t) {
                atLength = direction === 1 ? (t * l) : (l - (t * l));

                var p1 = path.getPointAtLength(atLength);

                // TODO: fix rotate
                // p2 = path.getPointAtLength((atLength)+direction),
                // angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
                // return 'translate(' + p1.x + ',' + p1.y + ') rotate(' + angle + ')';

                return 'translate(' + p1.x + ',' + p1.y + ')';
            }
        }
    }

    function showlogBook(port) {
        var logBook = document.getElementById('logbook');

        lightStartPort(port.index);

        logBook.querySelector('.history-title').innerText = port.title;
        logBook.querySelector('.history-date').innerText = port.date + ' ' + port.name + 'г.';
        logBook.querySelector('.history-description').innerText = port.description;
    }

    function lightStartPort(current) {
        document.querySelectorAll('.marker').forEach(function (i) {
            i.classList.remove('active');
            if (current == i.getAttribute('data-index')) {
                i.classList.add('active')
            }
        });
    }

    function checkClick(index) {
        lastClickIndex = index;
        if (click) {
            swim(index)
        }
    }
}