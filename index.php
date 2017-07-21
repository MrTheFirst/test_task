<!DOCTYPE html>
<html>
	<head>
		<title>Перечень страниц сайта</title>
		<meta charset="utf-8">
		<style type="text/css">
			* {
				font-family: Verdana;
				font-weight: normal;
			}
		</style>
	</head>
	<body>
		<?if(file_exists("inc_footer.php")) require_once "inc_description.php";?>
		<ol>
			<?
			// Функция получения Title страницы
			function page_title($url) {
				$fp = file_get_contents($url);
				if (!$fp) 
				return null;

				$res = preg_match("/<title>(.*)<\/title>/siU", $fp, $title_matches);
				if (!$res) 
				return null; 

				// Clean up title: remove EOL's and excessive whitespace.
				$title = preg_replace('/\s+/', ' ', $title_matches[1]);
				$title = trim($title);
				return $title;
			}
			$dontshow = array();
			$ext_exclude = " .ico .png .php .js .json";
			$files = array_diff(scandir(__DIR__), $dontshow);
			foreach ($files as $file)
			{
				// Получаем информацию о файле
				$file = pathinfo($file);
				// Получаем title
				$file["title"] = page_title($file["basename"]);

				if(!is_dir($file["basename"]) && !strpos($ext_exclude, $file["extension"]))
				{
					echo "<li><a href='" . $file["basename"] . "' target='_blank'>".$file["title"]."</a> " . $file["basename"] . "</li>";
				}
			}
			?>
		</ol>
		<?
			/*
			$html = new simple_html_dom();
			$html->load_file('http://google.com/'); //put url or filename in place of xxx
			$title = $html->find('title');
			echo $title->plaintext;

			$descr = $html->find('meta[description]');
			echo $descr->plaintext;
			*/
		?>
		<?if(file_exists("inc_footer.php")) require_once "inc_footer.php";?>
		<p>&nbsp;</p>
		<p>Проект разработан в <a href="http://www.lyrmin.ru" target="_blank">Решение.</a></p>
	</body>
</html>